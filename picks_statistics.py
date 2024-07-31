from functools import reduce  # Python3

import pandas as pd


def parse_old(file_path):
    # Load the CSV file into a pandas DataFrame
    df = pd.read_csv(file_path)

    # Now you can work with the DataFrame 'df'
    advice_choices = df[[' advice', ' choices']]
    total_choices = []
    total_advices = []
    for i in range(len(advice_choices)):
        total_choices.append(list(map(int, advice_choices.iloc[i][' choices'].split())))
        total_advices.append(list(map(int, advice_choices.iloc[i][' advice'].split())))
    total_choices = reduce(lambda x, y: x + y, total_choices)
    total_advices = reduce(lambda x, y: x + y, total_advices)
    total_advices_0 = total_advices.count(0)
    total_advices_0_choices_0 = 0
    for i in range(len(total_advices)):
        if total_advices[i] == 0 and total_choices[i] == 0:
            total_advices_0_choices_0 += 1
    # Calculate the percentage
    percentage = (total_advices_0_choices_0 / total_advices_0) * 100
    print(f"{file_path:<40} Num of users: {len(advice_choices):<10} The percentage is: {percentage:>6.2f}%")


def parse_old2(file_path):
    # Load the CSV file into a pandas DataFrame
    df = pd.read_csv(file_path)

    # Now you can work with the DataFrame 'df'
    advice_choices = df[[' advice', ' choices']]
    total_choices = []
    total_advices = []
    for i in range(len(advice_choices)):
        if advice_choices[' advice'].iloc[i] == advice_choices[' choices'].iloc[i]:
            continue
        total_choices.append(list(map(int, advice_choices.iloc[i][' choices'].split())))
        total_advices.append(list(map(int, advice_choices.iloc[i][' advice'].split())))
    total_choices = reduce(lambda x, y: x + y, total_choices)

    total_choices_0 = total_choices.count(0)
    # Calculate the percentage
    percentage = (total_choices_0 / len(total_choices)) * 100
    print(f"{file_path:<45} Num of users: {len(advice_choices):<10} The percentage is: {percentage:>6.2f}%")


def parse_new(file_path):
    # Load the CSV file into a pandas DataFrame
    df = pd.read_csv(file_path)

    # Now you can work with the DataFrame 'df'
    advice_choices = df[[' advice', ' choices']]
    total_choices = []
    total_advices = []
    for i in range(len(advice_choices)):
        total_choices.append(list(map(int, advice_choices.iloc[i][' choices'].split())))
        total_advices.append(list(map(int, advice_choices.iloc[i][' advice'].split())))
    for i in range(len(total_advices)):
        preferred_arm = total_advices[i][0]
        if preferred_arm == 1:
            for j in range(len(total_advices[i])):
                if total_advices[i][j] == 1:
                    total_advices[i][j] = 0
                else:
                    total_advices[i][j] = 1
                if total_choices[i][j] == 1:
                    total_choices[i][j] = 0
                else:
                    total_choices[i][j] = 1
    total_choices = reduce(lambda x, y: x + y, total_choices)
    total_advices = reduce(lambda x, y: x + y, total_advices)
    total_advices_0 = total_advices.count(0)
    total_advices_0_choices_0 = 0
    for i in range(len(total_advices)):
        if total_advices[i] == 0 and total_choices[i] == 0:
            total_advices_0_choices_0 += 1
    # Calculate the percentage
    percentage = (total_advices_0_choices_0 / total_advices_0) * 100
    print(f"{file_path:<40} Num of users: {len(advice_choices):<10} The percentage is: {percentage:>6.2f}%")


def parse_new2(file_path):
    # Load the CSV file into a pandas DataFrame
    df = pd.read_csv(file_path)

    # Now you can work with the DataFrame 'df'
    advice_choices = df[[' advice', ' choices']]
    total_choices = []
    total_advices = []
    for i in range(len(advice_choices)):
        total_choices.append(list(map(int, advice_choices.iloc[i][' choices'].split())))
        total_advices.append(list(map(int, advice_choices.iloc[i][' advice'].split())))
    for i in range(len(total_advices)):
        preferred_arm = total_advices[i][0]
        if preferred_arm == 1:
            for j in range(len(total_advices[i])):
                total_advices[i][j] ^= 1
                total_choices[i][j] ^= 1
        total_advices[i].pop()
        total_choices[i].pop()

    total_choices = reduce(lambda x, y: x + y, total_choices)
    total_advices = reduce(lambda x, y: x + y, total_advices)
    total_choices_0 = total_choices.count(0)
    # Calculate the percentage
    percentage = (total_choices_0 / len(total_choices)) * 100
    print(f"{file_path:<60} Num of users: {len(advice_choices):<10} The percentage is: {percentage:>6.2f}%")


def main():
    # parse_old2('backend/db.csv') # Naive preferred is the weak arm
    parse_old2('data/db_naive0_eyal.csv')
    parse_old2('data/db_behavioral_eyal_v2.csv')
    parse_old2('data/db_naive_eyal_3arms.csv')
    parse_old2('data/db_behavioral_eyal_3arms_v1.csv')
    # parse_old2('data/db_behavioral_eyal_3arms_v1_close.csv')
    # parse_old2('data/db_behavioral_eyal_3arms_v1_very_far.csv')
    parse_old2('data/db_naive_0_v2.csv')
    parse_old2('data/db_behavioral_3_v2.csv')


if __name__ == '__main__':
    main()
