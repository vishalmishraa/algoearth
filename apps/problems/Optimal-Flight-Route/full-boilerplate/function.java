
    import java.io.*;
    import java.util.*;
    
    public class Main {
        
        ##USER_CODE_HERE##
    
        public static void main(String[] args) {
            String filePath = "/Users/vishal/Desktop/PROJECTS/algoearth3/apps/problems/optimal-flight route/tests/inputs/##INPUT_FILE_INDEX##.txt"; 
            List<String> lines = readLinesFromFile(filePath);
            int departureCityID = Integer.parseInt(lines.get(0).trim());
  int arrivalCityID = Integer.parseInt(lines.get(1).trim());
  int maxStops = Integer.parseInt(lines.get(2).trim());
  int size_layoverCosts = Integer.parseInt(lines.get(3).trim());

            List<Integer> layoverCosts = new ArrayList<>(size_layoverCosts);

            String[] inputStream = lines.get(4).trim().split("\s+");

            for (String inputChar : inputStream)  {

              layoverCosts.add(Integer.parseInt(inputChar));

            }

  int maxLayoverTime = Integer.parseInt(lines.get(5).trim());
            List<Integer> result = findOptimalRoute(departureCityID, arrivalCityID, maxStops, layoverCosts, maxLayoverTime);
            System.out.println(result);
        }
        public static List<String> readLinesFromFile(String filePath) {
            List<String> lines = new ArrayList<>();
            try (BufferedReader br = new BufferedReader(new FileReader(filePath))) {
                String line;
                while ((line = br.readLine()) != null) {
                    lines.add(line);
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
            return lines;
        }
    }