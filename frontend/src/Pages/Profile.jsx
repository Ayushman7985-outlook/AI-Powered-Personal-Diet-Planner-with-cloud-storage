import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Save,
  Sparkles,
  UserRound
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "https://ai-powered-personal-diet-planner-with.onrender.com";

function Profile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    age: "",
    sex: "",
    height_cm: "",
    weight_kg: "",
    activity_level: "",
    dietary_preference: "",
    goal: "",
    allergies: "",
    cuisines: "",
    budget_per_day: "",
    timeline_weeks: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const token = localStorage.getItem("access_token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to load profile.");
      }

      const profile = data.profile || {};

      setForm({
        name: profile.name || "",
        age: profile.age || "",
        sex: profile.sex || "",
        height_cm: profile.height_cm || "",
        weight_kg: profile.weight_kg || "",
        activity_level: profile.activity_level || "",
        dietary_preference: profile.dietary_preference || "",
        goal: profile.goal || "",
        allergies: profile.allergies || "",
        cuisines: profile.cuisines || "",
        budget_per_day: profile.budget_per_day || "",
        timeline_weeks: profile.timeline_weeks || ""
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });

    setMessage("");
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const token = localStorage.getItem("access_token");

    if (!token) {
      navigate("/login");
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to update profile."
        );
      }

      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>

        <h2>
          Loading your profile...
        </h2>

        <p>
          Fetching your saved information.
        </p>
      </div>
    );
  }

  return (
    <div className="auth-page profile-page">
      <div className="auth-decoration"></div>

      <div className="profile-container">

        <Link to="/dashboard" className="auth-back">
          <ArrowLeft size={17} />
          Back to dashboard
        </Link>

        <div className="profile-card">

          <div className="profile-heading">

            <div className="profile-heading-icon">
              <UserRound size={22} />
            </div>

            <div>
              <p className="dashboard-overline">
                PERSONAL PROFILE
              </p>

              <h1>
                Your nutrition profile
              </h1>

              <p>
                Keep your information updated so NutriAI
                can generate more relevant meal plans.
              </p>
            </div>

          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          {message && (
            <div className="profile-success">
              {message}
            </div>
          )}

          <form
            className="profile-form"
            onSubmit={handleSubmit}
          >

            <div className="form-section">

              <div className="form-section-heading">
                <Sparkles size={18} />

                <div>
                  <h2>Basic information</h2>
                  <p>
                    Tell us a little about yourself.
                  </p>
                </div>
              </div>

              <div className="form-grid">

                <label>
                  Full name

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                  />
                </label>

                <label>
                  Age

                  <input
                    type="number"
                    name="age"
                    value={form.age}
                    onChange={handleChange}
                    placeholder="e.g. 21"
                    min="1"
                    max="120"
                  />
                </label>

                <label>
                  Sex

                  <select
                    name="sex"
                    value={form.sex}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select
                    </option>

                    <option value="Male">
                      Male
                    </option>

                    <option value="Female">
                      Female
                    </option>

                    <option value="Other">
                      Other
                    </option>

                    <option value="Prefer not to say">
                      Prefer not to say
                    </option>
                  </select>
                </label>

                <label>
                  Height (cm)

                  <input
                    type="number"
                    name="height_cm"
                    value={form.height_cm}
                    onChange={handleChange}
                    placeholder="e.g. 170"
                    min="50"
                    max="250"
                  />
                </label>

                <label>
                  Weight (kg)

                  <input
                    type="number"
                    name="weight_kg"
                    value={form.weight_kg}
                    onChange={handleChange}
                    placeholder="e.g. 65"
                    min="10"
                    max="300"
                    step="0.1"
                  />
                </label>

              </div>

            </div>


            <div className="form-section">

              <div className="form-section-heading">
                <UserRound size={18} />

                <div>
                  <h2>Lifestyle & preferences</h2>

                  <p>
                    These details help personalize your plan.
                  </p>
                </div>
              </div>


              <div className="form-grid">

                <label>
                  Activity level

                  <select
                    name="activity_level"
                    value={form.activity_level}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select activity level
                    </option>

                    <option value="Sedentary">
                      Sedentary
                    </option>

                    <option value="Lightly Active">
                      Lightly Active
                    </option>

                    <option value="Moderately Active">
                      Moderately Active
                    </option>

                    <option value="Very Active">
                      Very Active
                    </option>

                    <option value="Extremely Active">
                      Extremely Active
                    </option>
                  </select>
                </label>


                <label>
                  Dietary preference

                  <select
                    name="dietary_preference"
                    value={form.dietary_preference}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select preference
                    </option>

                    <option value="Vegetarian">
                      Vegetarian
                    </option>

                    <option value="Vegan">
                      Vegan
                    </option>

                    <option value="Non-Vegetarian">
                      Non-Vegetarian
                    </option>

                    <option value="Eggetarian">
                      Eggetarian
                    </option>
                  </select>
                </label>


                <label>
                  Goal

                  <select
                    name="goal"
                    value={form.goal}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select your goal
                    </option>

                    <option value="Weight Loss">
                      Weight Loss
                    </option>

                    <option value="Weight Gain">
                      Weight Gain
                    </option>

                    <option value="Muscle Gain">
                      Muscle Gain
                    </option>

                    <option value="General Wellness">
                      General Wellness
                    </option>

                    <option value="Healthy Eating">
                      Healthy Eating
                    </option>
                  </select>
                </label>


                <label>
                  Daily food budget (₹)

                  <input
                    type="number"
                    name="budget_per_day"
                    value={form.budget_per_day}
                    onChange={handleChange}
                    placeholder="e.g. 250"
                    min="0"
                  />
                </label>


                <label>
                  Plan timeline (weeks)

                  <input
                    type="number"
                    name="timeline_weeks"
                    value={form.timeline_weeks}
                    onChange={handleChange}
                    placeholder="e.g. 4"
                    min="1"
                    max="52"
                  />
                </label>

              </div>

            </div>


            <div className="form-section">

              <div className="form-section-heading">

                <Sparkles size={18} />

                <div>
                  <h2>Food preferences</h2>

                  <p>
                    Optional information for better personalization.
                  </p>
                </div>

              </div>


              <div className="form-grid">

                <label>
                  Allergies

                  <input
                    type="text"
                    name="allergies"
                    value={form.allergies}
                    onChange={handleChange}
                    placeholder="e.g. peanuts, dairy"
                  />
                </label>


                <label>
                  Preferred cuisines

                  <input
                    type="text"
                    name="cuisines"
                    value={form.cuisines}
                    onChange={handleChange}
                    placeholder="e.g. Indian, North Indian"
                  />
                </label>

              </div>

            </div>


            <div className="profile-actions">

              <Link
                to="/dashboard"
                className="btn btn-outline"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                <Save size={17} />

                {saving
                  ? "Saving..."
                  : "Save profile"}
              </button>

            </div>

          </form>

        </div>

        <p className="auth-disclaimer">
          NutriAI provides educational wellness examples,
          not medical or clinical advice.
        </p>

      </div>
    </div>
  );
}

export default Profile;