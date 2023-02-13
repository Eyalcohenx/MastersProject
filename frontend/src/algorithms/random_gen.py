import numpy as np 
import json

def main():
    k = 50
    o = {}

    for i in range(k):
        v = np.random.rand(10)
        t = np.any(v <= 0.1)
        if not t:
            j = np.random.randint(3, 10)
            v[j] = 0.1
            print("manipulated v[{}] = 0.1".format(j))

        o[str(i)] = v.tolist()

    json.dump(o, open('./vectors.json', 'w+'), indent=2)
        
if __name__ == "__main__":
    main()