
    import java.io.*;
    import java.util.*;
    
    public class Main {
        
        ##USER_CODE_HERE##
    
        public static void main(String[] args) {
            String filePath = "/dev/problems/Merge-Sorted-Arrays/tests/inputs/##INPUT_FILE_INDEX##.txt"; 
            List<String> lines = readLinesFromFile(filePath);
            
            List<Integer> result = mergeSortedArrays();
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