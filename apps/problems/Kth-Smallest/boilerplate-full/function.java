
            import java.io.*;
            import java.util.*;

            public class Main {
                
                ##USER_CODE_HERE##

                public static void main(String[] args) {
                    String filePath = "/dev/problems/Kth-Smallest/tests/inputs/##INPUT_FILE_INDEX##.txt"; 
                    List<String> lines = readLinesFromFile(filePath);
                    int size_A = Integer.parseInt(lines.get(0).trim());

        List<Integer> A = new ArrayList<>(size_A);

        String[] inputStream = lines.get(1).trim().split("\s+");

        for (String inputChar : inputStream)  {

          A.add(Integer.parseInt(inputChar));

        }

  int size_B = Integer.parseInt(lines.get(2).trim());

        List<Integer> B = new ArrayList<>(size_B);

        String[] inputStream = lines.get(3).trim().split("\s+");

        for (String inputChar : inputStream)  {

          B.add(Integer.parseInt(inputChar));

        }

  int K = Integer.parseInt(lines.get(4).trim());
                    int result = solve(A, B, K);
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