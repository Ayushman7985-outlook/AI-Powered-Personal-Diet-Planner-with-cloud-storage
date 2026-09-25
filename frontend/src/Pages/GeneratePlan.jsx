import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Sparkles
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "https://ai-powered-personal-diet-planner-with.onrender.com";

function GeneratePlan() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generatePlan() {
    const token = localStorage.getItem("access_token");

    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/generate-plan`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to generate diet plan."
        );
      }

      /*
       * Store the generated plan temporarily so the
       * Result page can display it.
       */
      sessionStorage.setItem(
        "generated_plan",
        JSON.stringify(data.plan?.[0] || data.plan)
      );

      sessionStorage.setItem(
        "plan_source",
        data.source || "unknown"
      );

      navigate("/plan-result");

    } catch (err) {
      console.error(err);
      setError(
        err.message ||
        "Something went wrong while generating the plan."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page generate-page">

      <div className="auth-decoration"></div>

      <div className="generate-container">

        <Link
          to="/dashboard"
          className="auth-back"
        >
          <ArrowLeft size={17} />
          Back to dashboard
        </Link>


        <div className="generate-card">

          <div className="generate-icon">
            <Brain size={28} />
          </div>


          <p className="dashboard-overline">
            AI NUTRITION ENGINE
          </p>


          <h1>
            Create your personalized plan
          </h1>


          <p className="generate-description">
            NutriAI will use the information saved in your
            profile to generate a general wellness-oriented
            daily meal plan.
          </p>


          <div className="generate-info">

            <div className="generate-info-item">

              <Sparkles size={18} />

              <div>
                <strong>
                  Profile-based
                </strong>

                <span>
                  Your age, lifestyle, preferences and goal
                  are used as inputs.
                </span>
              </div>

            </div>


            <div className="generate-info-item">

              <Brain size={18} />

              <div>
                <strong>
                  AI-powered
                </strong>

                <span>
                  The configured AI engine generates your
                  meal recommendations.
                </span>
              </div>

            </div>


            <div className="generate-info-item">

              <ArrowRight size={18} />

              <div>
                <strong>
                  Automatically saved
                </strong>

                <span>
                  Your generated plan is stored in the cloud
                  for later access.
                </span>
              </div>

            </div>

          </div>


          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}


          <button
            className="btn btn-primary generate-button"
            onClick={generatePlan}
            disabled={loading}
          >

            <Sparkles size={18} />

            {loading
              ? "Generating your plan..."
              : "Generate my plan"}

          </button>


          <p className="generate-note">
            This produces an educational general wellness
            example and is not medical advice.
          </p>

        </div>

      </div>

    </div>
  );
}

export default GeneratePlan;