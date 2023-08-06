from loader import *
import matplotlib.pyplot as plt


def main():
    dataset_trust = create_trust_dataset()
    Y = trust_average_per_turn = np.mean(dataset_trust, axis=0)

    X = range(1, 11)
    fig, ax = plt.subplots()
    ax.plot(X, trust_average_per_turn)
    plt.title('Trust in agent per turn')
    plt.ylabel('Compliance average')
    plt.xlabel('Turn')
    plt.xticks(X)

    for x, y in zip(X, Y):
        ax.annotate('{:.2f}'.format(y), xy=[x, y], textcoords='data')  # <--

    ax.grid()
    plt.show()


if __name__ == '__main__':
    main()