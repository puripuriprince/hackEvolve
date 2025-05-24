from datasets import load_dataset
import json

def main():
    try:
        # Option 1: Try loading with streaming=True to avoid schema issues
        print("Attempting to load dataset with streaming...")
        ds = load_dataset("allenai/wildjailbreak", "train", streaming=True)
        
        seeds = []
        count = 0
        for row in ds['train']:
            try:
                prompt = row['adversarial'] if row['adversarial'] else row['vanilla']
                response = row['completion']
                label = row['data_type']
                seeds.append({"prompt": prompt, "response": response, "label": label})
                count += 1
                if count % 1000 == 0:
                    print(f"Processed {count} examples...")
                # Limit to reasonable number for testing
                if count >= 10000:
                    break
            except Exception as e:
                print(f"Error processing row {count}: {e}")
                continue
                
    except Exception as e:
        print(f"Streaming approach failed: {e}")
        print("Trying alternative approach...")
        
        # Option 2: Try with explicit schema or different approach
        try:
            ds = load_dataset("allenai/wildjailbreak", "train", trust_remote_code=True)
            seeds = []
            for row in ds['train']:
                prompt = row['adversarial'] if row['adversarial'] else row['vanilla']
                response = row['completion'] 
                label = row['data_type']
                seeds.append({"prompt": prompt, "response": response, "label": label})
        except Exception as e2:
            print(f"Second approach also failed: {e2}")
            return
    
    # Save to JSONL file
    with open("wildjailbreak_seeds.jsonl", "w", encoding="utf-8") as f:
        for item in seeds:
            f.write(json.dumps(item, ensure_ascii=False) + "\n")
    
    print(f"Saved {len(seeds)} seeds to wildjailbreak_seeds.jsonl")

if __name__ == "__main__":
    main()