import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Message } from '../entities';
import {
  CreateMessageDto,
  FilterMessageDto,
  MessageDto,
  UpdateMessageDto,
  DeleteMessageDto,
} from '../dtos';
import { WsException } from '@nestjs/websockets';
import { TResultAndCount } from 'src/types/result-and-count.type';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async create(
    userId: string,
    createMessageDto: CreateMessageDto,
  ): Promise<TResultAndCount<MessageDto>> {
    try {
      const newMessage = this.messageRepository.create({
        ...createMessageDto,
        created_by: userId,
        updated_by: userId,
      });

      await this.messageRepository.save(newMessage);
      this.logger.log(`Message created successfully by User ID: ${userId}`);
      return await this.findByRoomId({ room_id: createMessageDto.roomId });
    } catch (error) {
      this.logger.error(
        `Failed to create message by User ID: ${userId}. Error: ${error.message}`,
        error.stack,
      );
      throw new WsException(
        'An error occurred while creating the message. Please try again.',
      );
    }
  }

  async findByRoomId(
    filterMessageDto: FilterMessageDto,
  ): Promise<TResultAndCount<MessageDto>> {
    const { first = 0, rows = 20, filter = '', room_id } = filterMessageDto;

    try {
      const [result, total] = await this.messageRepository.findAndCount({
        where: { text: ILike(`%${filter}%`), room_id },
        relations: ['creator'],
        order: { created_at: 'DESC' },
        take: rows,
        skip: first,
      });

      const sanitizedMessages = result.map((message) => {
        const { creator } = message;
        const { hashed_password, refresh_token, ...sanitizedCreator } = creator;
        return { ...message, creator: sanitizedCreator };
      });

      return { result: sanitizedMessages, total };
      // return message;
    } catch (error) {
      this.logger.error(
        `Failed to retrieve messages for room ID ${room_id}: ${error.message}`,
        error.stack,
      );

      if (error instanceof NotFoundException) {
        throw new WsException(
          error.message || 'The requested resource was not found.',
        );
      }

      if (error instanceof WsException) {
        throw error;
      }

      throw new WsException(
        'An error occurred while fetching messages. Please try again later.',
      );
    }
  }

  async update(
    userId: string,
    updateMessageDto: UpdateMessageDto,
  ): Promise<Message> {
    const { messageId, text } = updateMessageDto;

    try {
      const existingMessage = await this.messageRepository.findOne({
        where: { id: messageId },
      });

      if (!existingMessage) {
        throw new NotFoundException(
          `Message with ID "${messageId}" not found.`,
        );
      }

      if (existingMessage.created_by !== userId) {
        throw new WsException(
          'Access Denied: You can only update your own messages.',
        );
      }

      await this.messageRepository.update(
        { id: messageId },
        { text, created_at: new Date() },
      );

      this.logger.log(
        `Message ID ${messageId} updated successfully by User ID: ${userId}`,
      );

      return await this.messageRepository.findOne({
        where: {
          id: messageId,
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to update message ID ${messageId} by User ID: ${userId}. Error: ${error.message}`,
        error.stack,
      );
      if (error instanceof NotFoundException) {
        throw new WsException(
          error.message || 'The requested resource was not found.',
        );
      }

      if (error instanceof WsException) {
        throw error;
      }

      throw new WsException(
        'An error occurred while updating the message. Please try again.',
      );
    }
  }

  async delete(
    userId: string,
    deleteMessageDto: DeleteMessageDto,
  ): Promise<void> {
    const { room_id, message_ids } = deleteMessageDto;

    try {
      for (const messageId of message_ids) {
        const message = await this.messageRepository.findOne({
          where: { id: messageId, room_id },
        });

        if (!message) {
          this.logger.warn(
            `Message with ID "${messageId}" not found in room ID "${room_id}".`,
          );
          continue;
        }

        if (message.created_by !== userId) {
          throw new WsException(
            `Access Denied: You can only delete your own messages.`,
          );
        }

        await this.messageRepository.delete({ id: messageId });
        this.logger.log(
          `Message ID ${messageId} deleted successfully by User ID: ${userId}`,
        );
      }
    } catch (error) {
      this.logger.error(`Failed operation: ${error.message}`, error.stack);

      if (error instanceof WsException) {
        throw error;
      }

      throw new WsException(
        'An unexpected error occurred. Please try again later.',
      );
    }
  }
}
