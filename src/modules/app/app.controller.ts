import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { AppService } from "./app.service";

@ApiTags("System")
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @ApiOperation({ summary: "Health check endpoint" })
    @ApiResponse({
        status: 200,
        description: "Returns server health status",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Success",
                },
                data: {
                    type: "string",
                    example: "Server is up and running!",
                },
            },
        },
    })
    @Get("/health")
    healthCheck(): string {
        return this.appService.healthCheck();
    }
}
