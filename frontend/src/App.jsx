import {
  ArrowRight,
  Brain,
  Cloud,
  ShieldCheck,
  Sparkles
} from "lucide-react";

import {
  BrowserRouter,
  Link,
  Route,
  Routes
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import GeneratePlan from "./pages/GeneratePlan";
import PlanResult from "./pages/PlanResult";
import SavedPlans from "./pages/SavedPlans";
import CloudFiles from "./pages/CloudFiles";


function Landing() {
  return (
    <div className="app">

      <nav className="navbar">

        <div className="brand">

          <div className="brand-icon">
            <Sparkles size={20} />
          </div>

          <span>NutriAI</span>

        </div>


        <div className="nav-links">

          <a href="#features">
            Features
          </a>

          <a href="#how-it-works">
            How it works
          </a>

        </div>


        <div className="nav-actions">

          <Link
            to="/login"
            className="btn btn-outline"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="btn btn-primary"
          >
            Get Started
            <ArrowRight size={17} />
          </Link>

        </div>

      </nav>


      <main>

        {/* HERO SECTION */}

        <section className="hero">

          <div className="hero-content">

            <div className="eyebrow">

              <Sparkles size={15} />

              AI-powered personal nutrition

            </div>


            <h1>

              Your meals.
              <br />

              <span>
                Smarter every day.
              </span>

            </h1>


            <p className="hero-text">

              Create personalized daily diet plans based
              on your profile, goals, preferences and
              lifestyle — powered by AI and securely
              stored in the cloud.

            </p>


            <div className="hero-actions">

              <Link
                to="/register"
                className="btn btn-primary btn-large"
              >

                Create my plan

                <ArrowRight size={19} />

              </Link>


              <a
                href="#features"
                className="btn btn-ghost btn-large"
              >

                Explore features

              </a>

            </div>


            <div className="trust-row">

              <div>

                <ShieldCheck size={17} />

                Secure user data

              </div>


              <div>

                <Cloud size={17} />

                Cloud storage

              </div>


              <div>

                <Brain size={17} />

                AI-powered

              </div>

            </div>

          </div>


          <div className="hero-visual">

            <div className="glow glow-one"></div>

            <div className="glow glow-two"></div>


            <div className="nutrition-card">

              <div className="card-top">

                <div>

                  <p className="small-label">
                    TODAY'S PLAN
                  </p>

                  <h3>
                    Balanced Nutrition
                  </h3>

                </div>


                <div className="status-dot"></div>

              </div>


              <div className="meal-card">

                <div className="meal-icon">
                  ☀️
                </div>

                <div>

                  <span>
                    Breakfast
                  </span>

                  <strong>
                    Oats, banana & almonds
                  </strong>

                </div>

                <small>
                  420 kcal
                </small>

              </div>


              <div className="meal-card">

                <div className="meal-icon">
                  🥗
                </div>

                <div>

                  <span>
                    Lunch
                  </span>

                  <strong>
                    Dal, roti & vegetables
                  </strong>

                </div>

                <small>
                  560 kcal
                </small>

              </div>


              <div className="meal-card">

                <div className="meal-icon">
                  🍎
                </div>

                <div>

                  <span>
                    Snack
                  </span>

                  <strong>
                    Fruit & roasted chana
                  </strong>

                </div>

                <small>
                  210 kcal
                </small>

              </div>


              <div className="meal-card">

                <div className="meal-icon">
                  🌙
                </div>

                <div>

                  <span>
                    Dinner
                  </span>

                  <strong>
                    Paneer & vegetable roti
                  </strong>

                </div>

                <small>
                  490 kcal
                </small>

              </div>


              <div className="nutrition-footer">

                <div>

                  <span>
                    Daily target
                  </span>

                  <strong>
                    1,680 kcal
                  </strong>

                </div>


                <div className="progress">

                  <div className="progress-bar"></div>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* FEATURES */}

        <section
          className="features"
          id="features"
        >

          <div className="section-heading">

            <p className="eyebrow">
              BUILT FOR YOUR ROUTINE
            </p>

            <h2>
              Everything you need in one place.
            </h2>

            <p>
              From generating your plan to saving it
              securely, NutriAI keeps your nutrition
              workflow simple.
            </p>

          </div>


          <div className="feature-grid">

            <FeatureCard
              icon={<Brain size={22} />}
              title="AI-generated plans"
              text="Generate meal plans based on your personal profile, dietary preferences and goals."
            />


            <FeatureCard
              icon={<Cloud size={22} />}
              title="Cloud storage"
              text="Save your plans and personal files securely so you can access them whenever you need."
            />


            <FeatureCard
              icon={<ShieldCheck size={22} />}
              title="Private by design"
              text="Your profile, plans and uploaded files are isolated to your authenticated account."
            />

          </div>

        </section>


        {/* HOW IT WORKS */}

        <section
          className="how-section"
          id="how-it-works"
        >

          <div className="section-heading">

            <p className="eyebrow">
              HOW IT WORKS
            </p>

            <h2>
              Three simple steps.
            </h2>

          </div>


          <div className="steps">

            <div className="step">

              <span>
                01
              </span>

              <h3>
                Create your profile
              </h3>

              <p>
                Add your basic information, lifestyle,
                dietary preferences and personal goals.
              </p>

            </div>


            <div className="step">

              <span>
                02
              </span>

              <h3>
                Generate your plan
              </h3>

              <p>
                Our AI uses your profile to create a
                personalized general wellness meal plan.
              </p>

            </div>


            <div className="step">

              <span>
                03
              </span>

              <h3>
                Save & manage
              </h3>

              <p>
                Keep your plans in the cloud and access
                them from your dashboard whenever you need.
              </p>

            </div>

          </div>

        </section>

      </main>


      {/* FOOTER */}

      <footer>

        <div className="brand">

          <div className="brand-icon">

            <Sparkles size={17} />

          </div>

          <span>
            NutriAI
          </span>

        </div>


        <p>
          Educational wellness planning. Not medical advice.
        </p>

      </footer>

    </div>
  );
}


/* FEATURE CARD */

function FeatureCard({
  icon,
  title,
  text
}) {
  return (

    <div className="feature-card">

      <div className="feature-icon">

        {icon}

      </div>


      <h3>
        {title}
      </h3>


      <p>
        {text}
      </p>

    </div>

  );
}


/* MAIN APP */

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Landing />}
        />


        <Route
          path="/login"
          element={<Login />}
        />


        <Route
          path="/register"
          element={<Register />}
        />


        <Route
          path="/dashboard"
          element={<Dashboard />}
        />


        <Route
          path="/profile"
          element={<Profile />}
        />


        <Route
          path="/generate-plan"
          element={<GeneratePlan />}
        />


        <Route
          path="/plan-result"
          element={<PlanResult />}
        />


        <Route
          path="/saved-plans"
          element={<SavedPlans />}
        />


        <Route
          path="/cloud-files"
          element={<CloudFiles />}
        />


        <Route
          path="*"
          element={<Landing />}
        />

      </Routes>

    </BrowserRouter>

  );
}


export default App;