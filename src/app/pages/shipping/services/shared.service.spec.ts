import { TestBed } from "@angular/core/testing";

import { SharedService } from "./shared.service";

describe("SharedServiceService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: SharedService = TestBed.inject(SharedService);
    expect(service).toBeTruthy();
  });
});
