import {
  ArrowLeft,
  CalendarDays,
  Eye,
  Trash2,
  Sparkles
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const API_URL = "https://ai-powered-personal-diet-planner-with.onrender.com";

function SavedPlans() {
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPlans();
  }, []);

  async function loadPlans() {
    const token = localStorage.getItem("access_token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/plans`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to load saved plans.");
      }

      setPlans(data.plans || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function deletePlan(planId) {
    const token = localStorage.getItem("access_token");

    if (!window.confirm("Delete this saved plan?")) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/plans/${planId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to delete plan.");
      }

      setPlans((currentPlans) =>
        currentPlans.filter(
          (plan) => plan.plan_id !== planId
        )
      );
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <h2>Loading saved plans...</h2>
        <p>Fetching your plans from Supabase.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <main className="dashboard-main saved-plans-page">

        <Link to="/dashboard" className="auth-back">
          <ArrowLeft size={17} />
          Back to dashboard
        </Link>

        <header className="dashboard-header saved-plans-header">
          <div>
            <p className="dashboard-overline">
              CLOUD DATABASE
            </p>

            <h1>Your saved plans</h1>

            <p>
              Previously generated nutrition plans stored
              securely in your account.
            </p>
          </div>

          <Link
            to="/generate-plan"
            className="btn btn-primary"
          >
            <Sparkles size={17} />
            Generate new plan
          </Link>
        </header>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        {plans.length === 0 ? (
          <div className="dashboard-panel empty-state">
            <Sparkles size={30} />

            <h2>No saved plans yet</h2>

            <p>
              Generate your first personalized diet plan.
            </p>

            <Link
              to="/generate-plan"
              className="btn btn-primary"
            >
              Generate plan
            </Link>
          </div>
        ) : (
          <div className="saved-plans-grid">

            {plans.map((plan) => (
              <div
                className="dashboard-panel saved-plan-card"
                key={plan.plan_id}
              >

                <div className="saved-plan-top">
                  <div>
                    <p className="panel-label">
                      NUTRITION PLAN
                    </p>

                    <h2>
                      Personalized daily plan
                    </h2>
                  </div>

                  <div className="saved-plan-actions">
                    <Link
                      to={`/plan-result?id=${plan.plan_id}`}
                      className="icon-button"
                      title="View plan"
                    >
                      <Eye size={17} />
                    </Link>

                    <button
                      className="icon-button danger"
                      onClick={() => deletePlan(plan.plan_id)}
                      title="Delete plan"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>

                <div className="saved-plan-date">
                  <CalendarDays size={15} />

                  {plan.created_at
                    ? new Date(
                        plan.created_at
                      ).toLocaleString()
                    : "Date unavailable"}
                </div>

                <div className="saved-plan-meals">

                  <MealRow
                    label="Breakfast"
                    value={plan.breakfast}
                  />

                  <MealRow
                    label="Lunch"
                    value={plan.lunch}
                  />

                  <MealRow
                    label="Snack"
                    value={plan.snack}
                  />

                  <MealRow
                    label="Dinner"
                    value={plan.dinner}
                  />

                </div>

                <div className="saved-plan-summary">
                  <strong>Nutrition summary</strong>

                  <p>
                    {plan.nutrition_summary ||
                      "General wellness meal plan."}
                  </p>
                </div>

              </div>
            ))}

          </div>
        )}

      </main>
    </div>
  );
}

function MealRow({ label, value }) {
  return (
    <div className="saved-meal-row">
      <span>{label}</span>
      <strong>{value || "Not available"}</strong>
    </div>
  );
}

export default SavedPlans;