# %%
import csv
import json


def covert_index(label):
    label = int(label)
    b = label // 10**6
    r = label % 10**6
    c = r // 10**3
    v = r % 10**3
    return b, c, v


bible = {}
with open("trcn-esv.csv", newline="", encoding="utf-8") as f:
    reader = csv.reader(f)
    for row in reader:
        print(row)
        b, c, v = covert_index(row[0])
        text = row[2]
        bible.setdefault(b, {})
        bible[b].setdefault(c, {})
        bible[b][c][v] = text


with open("esv.json", "w", encoding="utf-8") as json_file:
    json.dump(bible, json_file, ensure_ascii=False)

# %%
