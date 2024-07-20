Problem Name: "Optimal Flight Route"
Function Name: findOptimalRoute
Input Structure:
Input Field: list<tuple<int, int, int>> flights
Input Field: int departureCityID
Input Field: int arrivalCityID
Input Field: int maxStops
Input Field: list<int> layoverCosts
Input Field: int maxLayoverTime
Input Field: list<tuple<int, int>> timeWindows
Input Field: dict<int, list<int>> cityConnections
Output Structure:
Output Field: list<int> route
Output Field: int totalCost
Output Field: int totalTime
Output Field: int totalStops
Output Field: bool withinBudget
Output Field: list<tuple<int, int>> layovers