from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import *
from sklearn.metrics import accuracy_score
from loader import *
from sklearn.model_selection import KFold
import random
import matplotlib.pyplot as plt

LISTENING_IDX = 0
ADVICE_IDX = 1
CHOICE_IDX = 2


def predictions_to_decisions(predictions, y_advice_choice_test):
    decisions = []
    for i, prediction in enumerate(predictions):
        advice = y_advice_choice_test[i][ADVICE_IDX]
        if prediction == WILL_LISTEN:
            decisions.append(advice)
        else:
            decisions.append(advice ^ 1)
    return decisions


def main():
    accuracy_averages = []
    for n in range(2, 10):
        print("n = " + str(n))
        dataset = create_ngram_set_advice_prio(n)
        # random.shuffle(dataset)

        X = [i[0][0] for i in dataset]
        y_advice_choice = [[i[0][1], i[ADVICE_IDX], i[CHOICE_IDX]] for i in dataset]

        # Use k-fold to check accuracy
        kf = KFold(n_splits=4)
        accuracies = []
        for j, (train_index, test_index) in enumerate(kf.split(X)):
            X_train, X_test, y_advice_choice_train, y_advice_choice_test = [X[i] for i in train_index],\
                                                                           [X[i] for i in test_index],\
                                                                           [y_advice_choice[i] for i in train_index],\
                                                                           [y_advice_choice[i] for i in test_index]
            y_train = [i[LISTENING_IDX] for i in y_advice_choice_train]
            gnb = GaussianNB()
            y_listen_pred = gnb.fit(X_train, y_train).predict(X_test)
            y_pred = predictions_to_decisions(y_listen_pred, y_advice_choice_test)
            y_test = [i[CHOICE_IDX] for i in y_advice_choice_test]
            accuracy = accuracy_score(y_test, y_pred)
            accuracies.append(accuracy)
            print('accuracy = ' + str(accuracy) + ' percentage 0 predicted = ' + str(y_pred.count(0)/len(y_pred)) +  ' percentage 1 predicted = ' + str(y_pred.count(1)/len(y_pred)))
        accuracy_average = np.mean(accuracies)
        print("Average accuracy = " + str(accuracy_average))
        accuracy_averages.append([n, accuracy_average])
        print("")

    X = [i[0]-1 for i in accuracy_averages]
    Y = [i[1] for i in accuracy_averages]
    fig, ax = plt.subplots()
    ax.plot(X, Y)
    plt.title('Average accuracy based per N-gram size')
    plt.ylabel('Average accuracy')
    plt.xlabel('N-gram size')
    plt.xticks(X)

    for x, y in zip(X, Y):
        ax.annotate('{:.3f}'.format(y), xy=[x, y], textcoords='data')  # <--

    ax.grid()
    plt.show()


if __name__ == '__main__':
    main()
