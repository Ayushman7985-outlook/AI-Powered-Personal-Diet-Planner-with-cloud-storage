import {
  Activity,
  ArrowRight,
  CalendarDays,
  Cloud,
  FileText,
  Flame,
  HeartPulse,
  LogOut,
  Plus,
  Sparkles,
  UserRound
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


const API_URL = "https://ai-powered-personal-diet-planner-with.onrender.com";

function Dashboard() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [plans, setPlans] = useState([]);
  const [files, setFiles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    loadDashboard();
  }, []);


  async function loadDashboard() {
    const token = localStorage.getItem("access_token");

    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const headers = {
        Authorization: `Bearer ${token}`
      };


      // Get profile

      const profileResponse = await fetch(
        `${API_URL}/api/profile`,
        {
          headers
        }
      );

      const profileData = await profileResponse.json();

      if (!profileResponse.ok) {
        throw new Error(
          profileData.error || "Unable to load profile."
        );
      }


      // Get saved plans

      const plansResponse = await fetch(
        `${API_URL}/api/plans`,
        {
          headers
        }
      );

      const plansData = await plansResponse.json();

      if (!plansResponse.ok) {
        throw new Error(
          plansData.error || "Unable to load diet plans."
        );
      }


      // Get cloud files

      const filesResponse = await fetch(
        `${API_URL}/api/files`,
        {
          headers
        }
      );

      const filesData = await filesResponse.json();

      if (!filesResponse.ok) {
        throw new Error(
          filesData.error || "Unable to load cloud files."
        );
      }


      setProfile(profileData.profile);
      setPlans(plansData.plans || []);
      setFiles(filesData.files || []);

    } catch (err) {

      console.error(err);

      setError(
        err.message ||
        "Something went wrong while loading the dashboard."
      );

    } finally {

      setLoading(false);

    }
  }


  function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");

    navigate("/login");
  }


  if (loading) {
    return (
      <div className="dashboard-loading">

        <div className="loading-spinner"></div>

        <h2>
          Loading your dashboard...
        </h2>

        <p>
          Fetching your profile, plans and cloud files.
        </p>

      </div>
    );
  }


  if (error) {
    return (
      <div className="dashboard-loading">

        <div className="auth-error">
          {error}
        </div>

        <button
          className="btn btn-primary"
          onClick={loadDashboard}
        >
          Try again
        </button>

      </div>
    );
  }


  const latestPlan =
    plans.length > 0
      ? plans[0]
      : null;


  const displayName =
    profile?.name || "there";


  const goal =
    profile?.goal || "Not set";


  return (
    <div className="dashboard-page">


      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="sidebar-brand">

          <div className="brand-icon">
            <Sparkles size={19} />
          </div>

          <span>
            NutriAI
          </span>

        </div>


        <nav className="sidebar-nav">

          <Link
            to="/dashboard"
            className="sidebar-link active"
          >
            <Activity size={18} />
            Dashboard
          </Link>


          <Link
            to="/generate-plan"
            className="sidebar-link"
          >
            <Sparkles size={18} />
            Generate Plan
          </Link>


          <Link
            to="/saved-plans"
            className="sidebar-link"
          >
            <FileText size={18} />
            Saved Plans
          </Link>


          <Link
            to="/cloud-files"
            className="sidebar-link"
          >
            <Cloud size={18} />
            Cloud Files
          </Link>


          <Link
            to="/profile"
            className="sidebar-link"
          >
            <UserRound size={18} />
            Profile
          </Link>

        </nav>


        <div className="sidebar-bottom">

          <div className="sidebar-tip">

            <Sparkles size={17} />

            <div>

              <strong>
                Personalized
              </strong>

              <span>
                Your plan adapts to your profile.
              </span>

            </div>

          </div>


          <button
            className="sidebar-logout"
            onClick={logout}
          >
            <LogOut size={17} />
            Sign out
          </button>

        </div>

      </aside>


      {/* MAIN */}

      <main className="dashboard-main">


        {/* HEADER */}

        <header className="dashboard-header">

          <div>

            <p className="dashboard-overline">
              PERSONAL NUTRITION
            </p>

            <h1>
              Good morning, {displayName} 👋
            </h1>

            <p>
              Here's what's happening with your nutrition today.
            </p>

          </div>


          <Link
            to="/generate-plan"
            className="btn btn-primary"
          >
            <Plus size={17} />
            New plan
          </Link>

        </header>


        {/* STATS */}

        <section className="dashboard-stats">


          <StatCard
            icon={<CalendarDays size={20} />}
            label="Plans created"
            value={plans.length}
            detail="Your saved plans"
          />


          <StatCard
            icon={<Flame size={20} />}
            label="Daily target"
            value="—"
            detail="Generated from your plan"
          />


          <StatCard
            icon={<HeartPulse size={20} />}
            label="Current goal"
            value={goal}
            detail="Based on your profile"
          />


          <StatCard
            icon={<Cloud size={20} />}
            label="Cloud files"
            value={files.length}
            detail="Stored securely"
          />

        </section>


        {/* CONTENT */}

        <section className="dashboard-grid">


          {/* LATEST PLAN */}

        {/* LATEST PLAN */}
<div className="dashboard-panel plan-panel latest-plan-panel">

  <div className="panel-heading">
    <div>
      <p className="panel-label">
        LATEST PLAN
      </p>

      <h2>
        Your nutrition plan
      </h2>

      {latestPlan && (
        <p className="latest-plan-date">
          Your most recently generated meal plan
        </p>
      )}
    </div>

    {latestPlan && (
      <span className="plan-status">
        Saved
      </span>
    )}
  </div>

  {latestPlan ? (
    <>
      <div className="dashboard-meals">

        <DashboardMeal
          emoji="☀️"
          meal="Breakfast"
          food={latestPlan.breakfast}
        />

        <DashboardMeal
          emoji="🥗"
          meal="Lunch"
          food={latestPlan.lunch}
        />

        <DashboardMeal
          emoji="🍎"
          meal="Snack"
          food={latestPlan.snack}
        />

        <DashboardMeal
          emoji="🌙"
          meal="Dinner"
          food={latestPlan.dinner}
        />

      </div>

      <div className="latest-plan-summary">
        <div className="latest-plan-summary-icon">
          <HeartPulse size={18} />
        </div>

        <div>
          <span>
            NUTRITION SUMMARY
          </span>

          <p>
            {latestPlan.nutrition_summary ||
              "Balanced general wellness meal plan."}
          </p>
        </div>
      </div>

      <Link
        to="/saved-plans"
        className="panel-action latest-plan-action"
      >
        View saved plans
        <ArrowRight size={16} />
      </Link>
    </>
  ) : (
    <div className="empty-state">
      <Sparkles size={28} />

      <h3>
        No diet plan yet
      </h3>

      <p>
        Create your first personalized plan
        using your profile.
      </p>

      <Link
        to="/generate-plan"
        className="btn btn-primary"
      >
        Generate plan
        <ArrowRight size={16} />
      </Link>
    </div>
  )}

</div>


          {/* QUICK ACTIONS */}

          <div className="dashboard-panel">

            <div className="panel-heading">

              <div>

                <p className="panel-label">
                  QUICK ACTIONS
                </p>

                <h2>
                  Manage your plan
                </h2>

              </div>

            </div>


            <div className="quick-actions">


              <Link
                to="/generate-plan"
                className="quick-action"
              >

                <div className="quick-icon">
                  <Sparkles size={19} />
                </div>

                <div>

                  <strong>
                    Generate new plan
                  </strong>

                  <span>
                    Create a fresh AI-powered plan.
                  </span>

                </div>

                <ArrowRight size={16} />

              </Link>


              <Link
                to="/profile"
                className="quick-action"
              >

                <div className="quick-icon">
                  <UserRound size={19} />
                </div>

                <div>

                  <strong>
                    Update profile
                  </strong>

                  <span>
                    Keep your nutrition preferences current.
                  </span>

                </div>

                <ArrowRight size={16} />

              </Link>


              <Link
                to="/cloud-files"
                className="quick-action"
              >

                <div className="quick-icon">
                  <Cloud size={19} />
                </div>

                <div>

                  <strong>
                    Cloud files
                  </strong>

                  <span>
                    Upload and manage your files.
                  </span>

                </div>

                <ArrowRight size={16} />

              </Link>

            </div>

          </div>

        </section>


        {/* PROFILE SUMMARY */}

        <section className="wellness-note">

          <div className="wellness-icon">
            <HeartPulse size={21} />
          </div>


          <div>

            <strong>
              Profile overview
            </strong>

            <p>
              {profile?.dietary_preference
                ? `${profile.dietary_preference} diet`
                : "Dietary preference not set"}
              {" • "}
              {profile?.activity_level
                ? profile.activity_level
                : "Activity level not set"}
              {" • "}
              Goal: {goal}
            </p>

          </div>

        </section>


        {/* DISCLAIMER */}

        <section className="wellness-note">

          <div className="wellness-icon">
            <HeartPulse size={21} />
          </div>


          <div>

            <strong>
              General wellness reminder
            </strong>

            <p>
              NutriAI provides educational meal-planning
              examples. It is not a substitute for professional
              medical or nutritional advice.
            </p>

          </div>

        </section>


      </main>

    </div>
  );
}


/* STAT CARD */

function StatCard({
  icon,
  label,
  value,
  detail
}) {
  return (
    <div className="stat-card">

      <div className="stat-icon">
        {icon}
      </div>


      <div className="stat-content">

        <span>
          {label}
        </span>

        <strong>
          {value}
        </strong>

        <small>
          {detail}
        </small>

      </div>

    </div>
  );
}


/* MEAL */
function DashboardMeal({
  emoji,
  meal,
  food
}) {
  return (
    <div className="dashboard-meal">

      <div className="dashboard-meal-icon">
        {emoji}
      </div>

      <div className="dashboard-meal-content">

        <span>
          {meal}
        </span>

        <strong>
          {food || "Not available"}
        </strong>

      </div>

    </div>
  );
}


export default Dashboard;