import pandas as pd
import numpy as np

dataset_file_path = "../data/db_ex2_random_no_user_data.csv"

REWARD = 4
ADVICE = 3
CHOICES = ' choices'
RESULTS = 6
WORKER_ID = 0
ASSIGNMENT_ID = 1
TURNS_PER_GAME = 10

# Situations that assumes the user giving a priority to the advice by the machine
LISTENED_AND_WON = 1
LISTENED_AND_LOST = 2
DIDNT_LISTENED_AND_WON = 3
DIDNT_LISTENED_AND_LOST = 4

WILL_LISTEN = 1
WONT_LISTEN = 0

# Situations that assumes the user giving a priority to the machine itself
FIRST_AND_WON = 1
FIRST_AND_LOST = 2
SECOND_AND_WON = 3
SECOND_AND_LOST = 4

FIRST_HAND = 0
SECOND_HAND = 1

# Relevant for both
START_TURN = 0


def get_advice_option(choice, advice, result):
    if choice == advice:
        if result > 50:
            return LISTENED_AND_WON
        else:
            return LISTENED_AND_LOST
    else:
        if result > 50:
            return DIDNT_LISTENED_AND_WON
        else:
            return DIDNT_LISTENED_AND_LOST


def create_advice_ngrams_from_game(game, n=4):
    ngrams = []
    for i in range(len(game)):
        x = []
        for j in range(i - n + 1, i + 1):
            if j == i:  # last round, fill y
                if game[j] == LISTENED_AND_WON or game[j] == LISTENED_AND_LOST:
                    y = WILL_LISTEN
                else:
                    y = WONT_LISTEN
            else:
                if j < 0:
                    x.append(START_TURN)
                else:
                    x.append(game[j])
        xy = [x, y]
        ngrams.append(xy)
    return ngrams


def create_ngram_set_advice_prio(n=4):
    pd_frame = pd.read_csv(dataset_file_path, dtype=str)
    dataset = []
    for i, row in pd_frame.iterrows():
        choices = [int(x) for x in row[' choices'].split()]
        advices = [int(x) for x in row[' advice'].split()]
        results = [int(x) for x in row[' results'].split()]
        game_history = [get_advice_option(choices[k], advices[k], results[k]) for k in range(len(results))]

        game_ngrams = create_advice_ngrams_from_game(game_history, n)

        dataset.extend([[game_ngrams[j], advices[j], choices[j]] for j in range(len(advices))])

    return dataset


def create_trust_dataset():
    pd_frame = pd.read_csv(dataset_file_path, dtype=str)
    dataset = []
    for i, row in pd_frame.iterrows():
        choices = [int(x) for x in row[' choices'].split()]
        advices = [int(x) for x in row[' advice'].split()]
        game_trust_history = [choices[k] ^ advices[k] ^ 1 for k in range(len(choices))]
        dataset.append(game_trust_history)

    return dataset


def create_choice_ngrams_from_game(choices, results, n=4):
    ngrams = []
    for i in range(len(choices)):
        x = []
        for j in range(i - n + 1, i + 1):
            if j == i:  # last round, fill y
                y = choices[j]
            else:
                if j < 0:
                    x.append(START_TURN)
                else:
                    if choices[j] == FIRST_HAND:
                        if results[j] > 50:
                            x.append(FIRST_AND_WON)
                        else:
                            x.append(FIRST_AND_LOST)
                    else:
                        if results[j] > 50:
                            x.append(SECOND_AND_WON)
                        else:
                            x.append(SECOND_AND_LOST)
        xy = [x, y]
        ngrams.append(xy)
    return ngrams


def create_choice_dataset(n=4):
    pd_frame = pd.read_csv(dataset_file_path, dtype=str)
    dataset = []
    for i, row in pd_frame.iterrows():
        choices = [int(x) for x in row[' choices'].split()]
        results = [int(x) for x in row[' results'].split()]
        game_choice_history = create_choice_ngrams_from_game(choices, results, n)
        dataset.extend(game_choice_history)

    return dataset


def main():
    dataset = create_choice_dataset()
    print('finished')


if __name__ == '__main__':
    main()
