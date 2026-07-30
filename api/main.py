import os
import sys
import json
import subprocess
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv
load_dotenv()

app = FastAPI()

# Add CORS middleware to allow React frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def run_script(script_name: str) -> dict:
    env = os.environ.copy()
    env["API_MODE"] = "true"
    
    # We use sys.executable to run with the current environment's Python interpreter
    cmd = [sys.executable, script_name]
    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            env=env,
            cwd=os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to execute script: {str(e)}")
        
    if result.returncode != 0:
        error_msg = result.stderr or result.stdout
        raise HTTPException(
            status_code=500,
            detail=f"Script exited with error code {result.returncode}. Output:\n{error_msg}"
        )
        
    # Find the JSON marker in stdout
    for line in result.stdout.splitlines():
        if line.startswith("__RESULTS_JSON__:"):
            try:
                json_str = line.split("__RESULTS_JSON__:", 1)[1]
                return json.loads(json_str)
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Failed to parse script output: {str(e)}")
                
    raise HTTPException(status_code=500, detail="No JSON output was found in the script execution.")

@app.get("/predict")
def predict():
    return run_script("agent.py")

@app.get("/backtest")
def backtest():
    return run_script("test-predictor.py")

@app.get("/status")
def status():
    import os
    from web3 import Web3
    rpc_online = False
    latest_block = None
    try:
        w3_temp = Web3(Web3.HTTPProvider(os.getenv("MAINNET_URL")))
        rpc_online = w3_temp.is_connected()
        if rpc_online:
            latest_block = w3_temp.eth.block_number
    except Exception:
        pass
    
    gemini_online = bool(os.getenv("GEMINI_API_KEY"))
    
    return {
        "backend": "online",
        "gemini": "online" if gemini_online else "offline",
        "rpc": "online" if rpc_online else "offline",
        "latest_block": latest_block
    }

