import { Test, TestingModule } from "@nestjs/testing";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

describe("AppController", () => {
    let controller: AppController;

    const mockAppService = {
        healthCheck: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AppController],
            providers: [AppService],
        })
            .overrideProvider(AppService)
            .useValue(mockAppService)
            .compile();

        controller = module.get<AppController>(AppController);
    });

    describe("healthCheck", () => {
        it("should call healthCheck method", async () => {
            await controller.healthCheck();

            expect(mockAppService.healthCheck).toHaveBeenCalled();
        });
    });
});
