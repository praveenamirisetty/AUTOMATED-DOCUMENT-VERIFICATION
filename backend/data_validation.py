import json
import requests
from datetime import datetime, date
from sklearn.feature_extraction.text import TfidfVectorizer

from sentence_transformers import SentenceTransformer, util
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

hard_fail = False
penalty = 0
status = ""
message = ""

sample_data = {
    "doc1": {
        "name": "Arjun Mehta",
        "dob": "12/04/1985",
        "gender": "M",
        "city": "Mumbai",
        "country": "IR",
    },
    "doc2": {
        "name": "Meht Arun",
        "dob": "12/04/1985",
        "gender": "M",
        "city": "Mumbai",
        "country": "IR",
        # "expiry_date": "19/09/2025"
    },
    "doc3": {
        "name": "Arjun Mehta",
        "dob": "12/04/1985",
    }
}

model = SentenceTransformer('all-MiniLM-L6-v2')

def sentence_cosine(name1, name2):
  emb1 = model.encode(name1, convert_to_tensor=True)
  emb2 = model.encode(name2, convert_to_tensor=True)

  cos_sim = util.cos_sim(emb1, emb2)
  return cos_sim.item()

def cosine_similarity_names(name1, name2):
    vectorizer = CountVectorizer(analyzer="char", ngram_range=(2,3)).fit_transform(names)
    cos_sim = cosine_similarity(vectorizer[0], vectorizer[1])
    return cos_sim[0][0]

def name_validation(name1, name2):
  cos_sim = cosine_similarity_names(name1, name2)
  sen_cos = sentence_cosine(name1, name2)
  alpha = 0.6
  score = alpha*sen_cos + (1-alpha)*cos_sim
  # print(f"{name1}, {name2} has a score of {score}")
  return score

def expiry_date_check(exp_date):
    if(datetime.strptime(exp_date, '%d/%m/%Y') <= datetime.today()):
        global hard_fail, message
        hard_fail = True
        message += "Document expired"
        return False
    return True

def country_check(country):
  sanctioned_countries = ["IR", "KP", "SY", "RU"]
  if(country[0] in sanctioned_countries):
      global penalty, message
      penalty += 20
      message += "Country sanctioned so penalty added\n"

def validate_data(data):

    try:
        response = requests.get("http://localhost:5000/api/watchlist")
        response.raise_for_status()  # Raise error if status != 200
        watchlist_data = response.json()       # This is now a Python list/dict
    except Exception as e:
        print("Failed to fetch watchlist:", e)
        return

    data = json.loads(data)
    docs = []

    for doc in data:
      if "expiry_date" in data[doc]:
        expiry_date_check(data[doc]['expiry_date'])
      docs.append(data[doc])
    
    report = cross_validate_fields(docs, ["dob", "country", "place"])
    is_tampered = tampered_data_check(report)
    
    if(not is_tampered):
      country_check(report['country']['unique_values'])
    
    main = docs[0]
    for i in range(1, len(docs)):
      score = name_validation(main['name'], docs[i]['name'])
      if score < 0.8:
        global penalty
        global message
        message += "Name mismatch\n"
        penalty += 25

    if(not hard_fail):
      print("Penalty: ", penalty)
      print(message)
    else:
      print("hard fail")
      print(message)

def cross_validate_fields(docs, keys):
    report = {}
    for key in keys:
        vals = []
        present_count = 0
        for d in docs:  # d is a dictionary representing a single document
            # Safely get the value; use get to avoid KeyError
            v = d.get(key)
            if v is not None and str(v).strip() != "":
                present_count += 1
                vals.append(str(v).strip())
        unique_vals = list(set(vals))
        report[key] = {
            "present_in_docs": present_count,
            "unique_values": unique_vals,
            "consistent": len(unique_vals) <= 1
        }
    return report

def tampered_data_check(report):
  print(report)
  for field in report:
    if report[field]['consistent'] != True:
      print(f"{field} is not consistent")
      global message, hard_fail
      message += "Tampered data\n"
      hard_fail = True
      return True
  return False

validate_data(json.dumps(sample_data))