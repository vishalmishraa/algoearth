
            import java.io.*;
            import java.util.*;

            public class Main {
                
                ##USER_CODE_HERE##

                public static void main(String[] args) {
                    String filePath = "/dev/problems/Sort-Array/tests/inputs/##INPUT_FILE_INDEX##.txt"; 
                    List<String> lines = readLinesFromFile(filePath);
                    int size_values = Integer.parseInt(lines.get(0).trim());

        List<Integer> values = new ArrayList<>(size_values);

        String[] inputStream = lines.get(1).trim().split("\s+");

        for (String inputChar : inputStream)  {

          values.add(Integer.parseInt(inputChar));

        }

                    List<Integer> result = sortArray(values);
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