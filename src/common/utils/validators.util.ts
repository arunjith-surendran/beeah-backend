import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

/**
 * Throws a `BadRequestException` if `value` is `null`, `undefined`, or a blank/whitespace-only
 * string. Use for any required input that isn't already validated by a DTO + `class-validator`
 * (e.g. a route param or query param read directly in a service method), so every service
 * reports the same 400 shape for the same kind of mistake instead of each one rolling its own check.
 *
 * @param value - Value to check.
 * @param fieldName - Name to reference in the error message.
 */
export function required<T>(
  value: T | null | undefined,
  fieldName: string,
): asserts value is T {
  const isBlankString = typeof value === 'string' && value.trim() === '';
  if (value === null || value === undefined || isBlankString) {
    throw new BadRequestException(`${fieldName} is required`);
  }
}

/**
 * Throws a `NotFoundException` if `value` is `null`/`undefined`, narrowing the type afterward.
 * Use for single-record lookups (e.g. a repository call that can return `null`).
 *
 * @param value - Value to check.
 * @param message - Message for the thrown exception.
 */
export function notFoundException<T>(
  value: T | null | undefined,
  message: string,
): asserts value is T {
  if (value === null || value === undefined) {
    throw new NotFoundException(message);
  }
}

/**
 * Throws a `NotFoundException` if `items` is empty. Use when "no results" means
 * "nothing matched" rather than "an empty list is a valid answer".
 *
 * @param items - List to check.
 * @param message - Message for the thrown exception.
 */
export function notFoundExceptionList<T>(items: T[], message: string): void {
  if (items.length === 0) {
    throw new NotFoundException(message);
  }
}

/**
 * Throws a `ConflictException` if `exists` is `true`. Use for uniqueness checks
 * (e.g. "this email is already registered").
 *
 * @param exists - Whether the conflicting record already exists.
 * @param message - Message for the thrown exception.
 */
export function conflictException(exists: boolean, message: string): void {
  if (exists) {
    throw new ConflictException(message);
  }
}

/**
 * Throws an `UnauthorizedException` if `isValid` is `false`. Use for credential/token checks
 * (e.g. password comparison, refresh token match).
 *
 * @param isValid - Whether the credential/token check passed.
 * @param message - Message for the thrown exception.
 */
export function unauthorizedException(isValid: boolean, message: string): void {
  if (!isValid) {
    throw new UnauthorizedException(message);
  }
}
