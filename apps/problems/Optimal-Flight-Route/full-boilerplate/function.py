##USER_CODE_HERE##

    def main():
        departureCityID = int(input().strip())
  arrivalCityID = int(input().strip())
  maxStops = int(input().strip())
  size_layoverCosts = int(input().strip())
layoverCosts = [List[int](x) for x in input().strip().split()]
  maxLayoverTime = int(input().strip())
        result = findOptimalRoute(departureCityID, arrivalCityID, maxStops, layoverCosts, maxLayoverTime);
        print(result);

    if __name__ == "__main__":
        main()
    