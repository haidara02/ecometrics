import csv
import sys
from collections import Counter

def get_most_common_companies(csv_file):
    with open(csv_file, 'r', newline='') as file:
        reader = csv.DictReader(file)
        company_names = [row['company_name'] for row in reader]
        company_counter = Counter(company_names)
        most_common_companies = company_counter.most_common()
        return most_common_companies

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python program.py input_file.csv")
        sys.exit(1)

    input_file = sys.argv[1]

    most_common_companies = get_most_common_companies(input_file)

    if most_common_companies:
        print("Most common companies:")
        for company, count in reversed(most_common_companies):
            print(f"{company}: {count} occurrences")
    else:
        print("No data found in the CSV file.")