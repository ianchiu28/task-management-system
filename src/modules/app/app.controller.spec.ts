import { Test, TestingModule } from "@nestjs/testing";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

describe("AppController", () => {
    let appController: AppController;

    const mockAppService = {
        healthCheck: jest.fn(),
    };

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [AppController],
            providers: [AppService],
        })
            .overrideProvider(AppService)
            .useValue(mockAppService)
            .compile();

        appController = app.get<AppController>(AppController);
    });

    describe("healthCheck", () => {
        it("should call healthCheck method", async () => {
            await appController.healthCheck();

            expect(mockAppService.healthCheck).toHaveBeenCalled();
        });
    });
});
