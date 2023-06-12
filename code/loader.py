import pandas as pd
import numpy as np

REWARD = 4
ADVICE = 3
CHOICES = 5
RESULTS = 6
WORKER_ID = 0
ASSIGNMENT_ID = 1


def create_ngram_set():
    pd_frame = pd.read_csv("../data/db_all.csv", dtype=str)
    dataset = []
    for i, row in pd_frame.iterrows():
        user_set = []
        mat = np.ones((11, 3)) * (-1)
        choices = row[CHOICES].split()
        advices = row[ADVICE].split()
        results = row[RESULTS].split()
        # first round - start matrix
        mat[0][1] = int(advices[0])
        user_set.append((mat, choices[0]))
        for k in range(1, 10):
            mat[k][0] = int(choices[k - 1])
            mat[k][1] = int(advices[k - 1])
            mat[k][2] = float(results[k - 1]) / 100
            mat[k + 1][1] = int(advices[k])
            user_set.append((mat, choices[k]))

        dataset.append(user_set)
    return dataset


def main():
    data = create_ngram_set()
    print(data)


if __name__ == '__main__':
    main()