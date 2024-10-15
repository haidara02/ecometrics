#!/usr/bin/env python3
"""
Run this on multiple csvs to generate a unique list of companies and their industry, then write them to a file.
"""

import csv
import sys
import shutil
import requests
from bs4 import BeautifulSoup
import concurrent.futures
import time
import json

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

def read_csv_file(filenames):
    company_industries = {}
    
    # Open csv and loop to build dictionary
    #   - Key: company_name
    #   - Value: industry (empty for now)
    for filename in filenames:
        with open(filename, 'r', newline='') as csvfile:
            csv_reader = csv.DictReader(csvfile)
            for row in csv_reader:
                company_name = row['company_name']
                company_industries[company_name] = ""

    return company_industries

def write_dict_to_file(filename, company_industries):
    with open(filename, 'w') as file:
        json.dump(company_industries, file)

def main():
    start_time = time.time()
    
    if len(sys.argv) <= 1:
        print("Incorrect use case: python3 getUniqueCompaniesData.py 'file1' 'file2' ...")
        return
    
    # Parse csv data to calculate ranking score for company
    file_name = sys.argv[1:]
    company_industries = read_csv_file(file_name)
    fetch_industries(company_industries)
    write_dict_to_file("company_industry_mapping.txt", company_industries)
    
    # Print time taken
    end_time = time.time()
    print(f"Process took {end_time - start_time} seconds.")
    
if __name__ == "__main__":
    main()