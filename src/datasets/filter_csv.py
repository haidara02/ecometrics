import csv
import sys

def filter_csv(input_file, output_file, company_names):
    with open(input_file, 'r', newline='') as infile, \
            open(output_file, 'w', newline='') as outfile:
        reader = csv.DictReader(infile)
        writer = csv.DictWriter(outfile, fieldnames=reader.fieldnames)
        writer.writeheader()
        
        for row in reader:
            if row['company_name'] in company_names:
                try:
                    writer.writerow(row)
                except:
                    print("Error writing row:", row)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python program.py input_file.csv company_name1 company_name2 ...")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = "filtered_" + input_file
    company_names = sys.argv[2:]

    filter_csv(input_file, output_file, company_names)
    print("Filtered CSV file created:", output_file)
