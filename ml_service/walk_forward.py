import numpy as np
from sklearn.metrics import accuracy_score


def walk_forward_validation(model, X, y, window=200):
    accuracies = []

    for i in range(window, len(X)):
        X_train = X.iloc[:i]
        y_train = y[:i]

        X_test = X.iloc[i:i+1]
        y_test = y[i:i+1]

        model.fit(X_train, y_train)
        pred = model.predict(X_test)

        accuracies.append(accuracy_score(y_test, pred))

    return np.mean(accuracies)
