import { z } from "zod";

export abstract class BaseDto {
  static schema = z.object({});

  static validate(data: unknown) {
    const result = this.schema.safeParse(data);

    if (!result.success) {
      return {
        data: null,
        error: result.error.flatten().fieldErrors,
      };
    }

    return {
      data: result.data,
      error: null,
    };
  }
}