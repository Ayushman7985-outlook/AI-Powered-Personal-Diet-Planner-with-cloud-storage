import json
import os
import random

import requests # type: ignore
from dotenv import load_dotenv # type: ignore


load_dotenv()


FOOD_DATA_PATH = os.path.join(
    os.path.dirname(__file__),
    "food_data.json"
)


def load_food_data():
    with open(FOOD_DATA_PATH, "r", encoding="utf-8") as file:
        return json.load(file)


def generate_fallback_plan(profile):
    """
    Rule-based fallback diet plan.

    This is a general wellness example and is not medical advice.
    """

    food_data = load_food_data()

    dietary_preference = (
        profile.get("dietary_preference") or "Vegetarian"
    ).lower()

    goal = (
        profile.get("goal") or "General Wellness"
    ).lower()

    meals = {
        "breakfast": random.choice(food_data["breakfast"]),
        "lunch": random.choice(food_data["lunch"]),
        "snack": random.choice(food_data["snack"]),
        "dinner": random.choice(food_data["dinner"])
    }

    nutrition_summary = (
        "General balanced meal plan with meals containing "
        "carbohydrates, protein, vegetables/fruits and healthy fats."
    )

    if "weight loss" in goal:
        nutrition_summary = (
            "General weight-management plan emphasizing balanced meals, "
            "vegetables, protein-rich foods and controlled portions."
        )

    if "vegan" in dietary_preference:
        nutrition_summary += (
            " Vegan users should replace dairy-based foods with suitable "
            "plant-based alternatives."
        )

    return {
        "breakfast": meals["breakfast"],
        "lunch": meals["lunch"],
        "snack": meals["snack"],
        "dinner": meals["dinner"],
        "nutrition_summary": nutrition_summary,
        "source": "rule_based_fallback"
    }


def build_ai_prompt(profile):
    """
    Construct the prompt sent to the AI API.
    """

    return f"""
Create a general wellness-oriented daily diet plan using the following
user profile.

Name: {profile.get("name")}
Age: {profile.get("age")}
Sex: {profile.get("sex")}
Height: {profile.get("height_cm")} cm
Weight: {profile.get("weight_kg")} kg
Activity level: {profile.get("activity_level")}
Dietary preference: {profile.get("dietary_preference")}
Goal: {profile.get("goal")}
Allergies: {profile.get("allergies")}
Preferred cuisines: {profile.get("cuisines")}
Daily budget: {profile.get("budget_per_day")}
Timeline: {profile.get("timeline_weeks")} weeks

Return ONLY valid JSON in exactly this structure:

{{
    "breakfast": "meal description",
    "lunch": "meal description",
    "snack": "meal description",
    "dinner": "meal description",
    "nutrition_summary": "short general nutrition summary"
}}

Do not provide medical diagnosis or treatment.
This is an educational/general wellness plan, not medical advice.
"""


def validate_ai_response(data):
    """
    Validate the minimum structure required by the application.
    """

    required_fields = [
        "breakfast",
        "lunch",
        "snack",
        "dinner",
        "nutrition_summary"
    ]

    if not isinstance(data, dict):
        return False

    return all(
        field in data and data[field]
        for field in required_fields
    )


def generate_ai_plan(profile):
    """
    Try the configured AI API first.

    If the API is unavailable, incorrectly configured, or returns
    invalid data, automatically use the local fallback engine.
    """

    fallback_plan = generate_fallback_plan(profile)

    ai_api_url = os.getenv("AI_API_URL")
    ai_api_key = os.getenv("AI_API_KEY")
    ai_model = os.getenv("AI_MODEL")

    if not ai_api_url or not ai_api_key:
        return fallback_plan

    prompt = build_ai_prompt(profile)

    headers = {
        "Authorization": f"Bearer {ai_api_key}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": ai_model,
        "prompt": prompt
    }

    try:
        response = requests.post(
            ai_api_url,
            headers=headers,
            json=payload,
            timeout=30
        )

        response.raise_for_status()

        result = response.json()

        if validate_ai_response(result):
            result["source"] = "ai_api"
            return result

        return fallback_plan

    except Exception:
        return fallback_plan