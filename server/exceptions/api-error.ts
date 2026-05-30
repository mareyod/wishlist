export default class ApiError extends Error{
    status: number;
    errors: unknown[];

    constructor(status: number, message: string, errors: unknown[] = []){
        super(message);
        this.status = status
        this.errors = errors
    }

    static UnauthorizedError(): ApiError {
        return new ApiError(401, 'Пользователь не авторизован')
    }

    static BadRequest(message: string, errors: unknown[] = []): ApiError{
        return new ApiError(400, message, errors)
    }

    static NotFound(message: string, errors: unknown[] = []): ApiError{
        return new ApiError(404, message, errors)
    }

    static Forbidden(): ApiError{
        return new ApiError(403 , 'Нет доступа')
    }
}