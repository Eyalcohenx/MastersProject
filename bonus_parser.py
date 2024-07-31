import math

import numpy as np
import pandas as pd


def main():
    file_path = 'backend/db.csv'

    # Load the CSV file into a pandas DataFrame
    df = pd.read_csv(file_path)

    # Take only lines with assignmentId = 668d5f431261927d73e56e6f
    # df = df.loc[df[' assignmentId'] == '668d5f431261927d73e56e6f']

    # Now you can work with the DataFrame 'df'
    worker_reward = df[['workerId', ' reward', ' timeToReadInstructions', ' timeToTakeQuiz', ' quizWrongTriesCounter', ' answerTimePerRound']]
    worker_reward['bonus'] = np.ceil(((worker_reward[' reward'] / 100) * 3) / 1.26) / 100

    # sort lines by bonus
    # worker_reward = worker_reward.sort_values(by='bonus', ascending=False)

    # print(worker_reward.loc[worker_reward['bonus'] == 19])
    # print worker_reward and make sure it shows all values
    # print(worker_reward.to_string())
    print(worker_reward[['workerId', 'bonus']].to_string())


if __name__ == '__main__':
    main()