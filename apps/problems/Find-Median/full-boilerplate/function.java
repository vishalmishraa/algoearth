
    import java.io.*;
    import java.util.*;
    
    public class Main {
        
        ##USER_CODE_HERE##
    
        public static void main(String[] args) {
            String filePath = "/Users/vishal/Desktop/PROJECTS/algoearth3/apps/problems/find-median/tests/inputs/##INPUT_FILE_INDEX##.txt"; 
            List<String> lines = readLinesFromFile(filePath);
            int size_numbers = Integer.parseInt(lines.get(0).trim());

            List<Integer> numbers = new ArrayList<>(size_numbers);

            String[] inputStream = lines.get(1).trim().split("\s+");

            for (String inputChar : inputStream)  {

              numbers.add(Integer.parseInt(inputChar));

            }

            float result = findMedian(numbers);
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