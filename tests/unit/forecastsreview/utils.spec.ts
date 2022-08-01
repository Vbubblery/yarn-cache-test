import { myForecastCalc } from "@/components/base/table/utils/demand";

describe("My forecast display in demand table", () => {
  it("returns '-' if value is not a number", () => {
    expect(myForecastCalc({ value: NaN }, () => {})).toEqual("-");
  });
  it("returns the same value if value is null", () => {
    expect(myForecastCalc({ value: null }, () => {})).toEqual(null);
  });
  it("applies callback if value is defined and is not NaN", () => {
    const callback = jest.fn();
    myForecastCalc({ value: 10 }, callback);
    expect(callback).toHaveBeenCalledWith(10);
  });
});
