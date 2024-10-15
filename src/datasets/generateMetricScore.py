#!/usr/bin/env python3
"""
Run this on a csv to generate valid metric values. It will also fill in a new column, company_industry, which outlines
the industry the company belongs to in a short description.

What does it do?
This script will rank every single company for a particular metric. The final metric value column will be replaced by the equation
= '1.0 - rank/max_companies_with_metric * 100'
for a score between 0-100.
"""

import csv
import sys
import shutil
import requests
from bs4 import BeautifulSoup
import concurrent.futures
import time

def scrape_company_industry(company_name):
    # Replace spaces with '+' for the search query
    try:
        # queries need to have spaces replaced with '+'
        company_name_formatted = '+'.join(company_name.split())
        search_query = f"what+is+the+industry+of+the+company+{company_name_formatted}"
        search_url = f"https://www.google.com/search?q={search_query}"
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
        
        response = requests.get(search_url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')

        # Update the class name or other attributes as needed
        # This is purely from inspecting the page element on google, could change...
        description_element = soup.find('span', class_='BxUVEf ILfuVd')

        if description_element:
            description = description_element.text
            res = description.strip()
            print(f"Scraped {company_name} and got: {res}")
            return res
        else:
            print("No description element found.")
            return "Unknown industry"
    except Exception as e:
        print(f"Error occurred: {e}")
        return "Unknown industry"

def fetch_industries(company_industries):
    # Multithread - open new thread for each company as futures
    with concurrent.futures.ThreadPoolExecutor() as executor:
        future_to_company = {executor.submit(scrape_company_industry, company_name): company_name for company_name in company_industries}
        for future in concurrent.futures.as_completed(future_to_company):
            company_name = future_to_company[future]
            try:
                industry = future.result()
                if industry:
                    company_industries[company_name] = industry
            except Exception as e:
                print(f"Error occurred while fetching industry for {company_name}: {e}")

def read_csv_file(filename, do_scrape):
    data_dict = {}
    company_industries = {}
    
    # Open csv and loop to build dictionary
    #   - Key: [metric_name, metric_year]
    #   - Value: list of pairs [company_name, metric_value]
    with open(filename, 'r', newline='') as csvfile:
        csv_reader = csv.DictReader(csvfile)
        for row in csv_reader:
            metric_name = row['metric_name']
            metric_year = row['metric_year']
            company_name = row['company_name']
            metric_value = float(row['metric_value'])
            key = (metric_name, metric_year)
            
            # Append data
            # e.g. 
            # {
                # [AVGHOURS, 12/31/2021]: [[Samsung, 10], [Apple, 20]]
            # }
            if key not in data_dict:
                data_dict[key] = []
            data_dict[key].append([company_name, metric_value])
            
            # Scrape and append company industry to company
            # if company_name not in company_industries:
            #     company_industries[company_name] = ""
            # if do_scrape:
            #     company_industries[company_name] = scrape_company_industry(company_name)
            if do_scrape:
                company_industries[company_name] = ""
    
    # Sort the lists based on metric_value
    # We're ranking each company within this metric, e.g.
        # Samsung, 0.0
        # Apple, 0.0
        # Microsoft, 0.5
        # Optus, 0.8

        # Becomes
        
        # Samsung, 3/3
        # Apple, 3/3
        # Microsoft, 2/3
        # Optus, 1/3
        
        # Becomes
        
        # Samsung, 0
        # Apple, 0
        # Microsoft, 33.33
        # Optus, 66.66
    for key, data_list in data_dict.items():
        data_list.sort(key=lambda x: x[1], reverse=True)
        rank = 1

        for i in range(len(data_list)):
            # Calculate rank as the number of companies with a higher value plus 1
            # Score = 1 - rank * 100, so rank 1/100 => 99
            score = (1.0 - (rank / len(data_list))) * 100
            data_list[i].append(score)
            if i < len(data_list) - 1 and data_list[i][1] != data_list[i + 1][1]:
                rank += 1
            
            # Rank only (OLD, but useful to look at)
            # data_list[i].append(f"{rank}/{len(data_list)}")
            # if i < len(data_list) - 1 and data_list[i][1] != data_list[i + 1][1]:
            #     rank += 1 
    return (data_dict, company_industries)

def print_metric_dictionary(metric_data):
    for key, data_list in metric_data.items():
        metric_name, metric_year = key
        print(f"{metric_name} ({metric_year}):")
        for company_data in data_list:
            print(f"\t{company_data[0]}: {company_data[1]} ({company_data[2]})")

def write_rankings_to_file(data_dict, company_industries, original_filename):
    export_filename = original_filename.replace('.csv', '_export.csv')
    with open(export_filename, 'r+', newline='') as csvfile:
        fieldnames = ['company_name', 'perm_id', 'data_type', 'disclosure', 'metric_description',
                      'metric_name', 'metric_unit', 'metric_value', 'metric_year', 'nb_points_of_observations',
                      'metric_period', 'provider_name', 'reported_date', 'pillar', 'headquarter_country']
        
        # New heading (industry)
        fieldnames.append('company_industry')

        # Loop through each line
        csv_reader = csv.reader(csvfile)
        rows = list(csv_reader)  

        company_name_index = fieldnames.index('company_name')
        metric_year_index = fieldnames.index('metric_year')
        metric_name_index = fieldnames.index('metric_name')
        metric_value_index = fieldnames.index('metric_value')
        
        for row_index, row in enumerate(rows):
            print(row)
            
            # Match current name against dictionary entries
            curr_company_name = row[company_name_index]
            curr_metric_year = row[metric_year_index]
            curr_metric_name = row[metric_name_index]
            
            # Search for matching rank
            for key, data_list in data_dict.items():
                metric_name, metric_year = key
                if curr_metric_year == metric_year and curr_metric_name == metric_name:
                    for company_data in data_list:
                        if company_data[0] == curr_company_name:
                            # Found it! 
                            rank_calculation = company_data[2]
                            # Now overwrite the metric_value cell of this particular row in the csv
                            rows[row_index][metric_value_index] = str(rank_calculation)
                            
                            # Add new column, company industry
                            if curr_company_name in company_industries:
                                rows[row_index].append(company_industries[curr_company_name])
                            else:
                                rows[row_index].append("Unknown industry")
                            break

        # Write updated rows back to the CSV file
        csvfile.seek(0)
        csv_writer = csv.writer(csvfile)
        csv_writer.writerows(rows)

def duplicate_csv_file(original_filename):
    export_filename = original_filename.replace('.csv', '_export.csv')
    shutil.copyfile(original_filename, export_filename)

def main():
    start_time = time.time()
    
    if len(sys.argv) != 3:
        print("Incorrect use case: python3 generateMetricScore.py 'file.csv' YES|NO (to webscrape data)")
        return
    
    # Parse csv data to calculate ranking score for company
    file_name = sys.argv[1]
    do_scrape = sys.argv[2] == "YES"
    metric_data, company_industries = read_csv_file(file_name, do_scrape)
    print_metric_dictionary(metric_data)
    
    if do_scrape:
        fetch_industries(company_industries)
    
    # Duplicate file and write to new file
    duplicate_csv_file(file_name)
    write_rankings_to_file(metric_data, company_industries, file_name)
    
    # Print time taken
    end_time = time.time()
    print(f"Process took {end_time - start_time} seconds.")
    
if __name__ == "__main__":
    main()