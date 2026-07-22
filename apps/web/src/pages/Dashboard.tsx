import { useNavigate } from "react-router";
import { useCreateFamily, useFamilies } from "../hooks/useFamily";
import { useState } from "react";
import { queryClient } from "../lib/queryClient";
import { toast } from "sonner";
import { isAxiosError } from "axios";

const Dashboard = () => {
  const token = localStorage.getItem("token");
  const { data: families, isLoading } = useFamilies();
  const { mutate: createFamily, isPending } = useCreateFamily();
  const navigate = useNavigate();
  const [isOpenFamilyForm, setIsOpenFamilyForm] = useState(false);
  const [familyName, setFamilyName] = useState("");

  const user = JSON.parse(localStorage.getItem("user") ?? "null");

  const handleCreateFamily = (e: React.FormEvent) => {
    e.preventDefault();
    createFamily(
      { name: familyName },
      {
        onSuccess: () => {
          toast.success("Family created successfully!");
        },
        onError: (error) => {
          if (isAxiosError(error)) {
            if (error.response?.status === 401) {
              toast.error("Please log in to continue.");
              return;
            }
            toast.error(error.response?.data?.error ?? "Something went wrong!");
          }
        },
      },
    );
    setFamilyName("");
    setIsOpenFamilyForm(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    queryClient.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-20 flex items-center justify-between border-b border-primary-light bg-white/80 px-6 py-4 backdrop-blur-sm sm:px-10">
        <span className="font-serif text-lg text-primary-dark">FamilyRoot</span>
        {token ? (
          <button
            onClick={handleLogout}
            className="rounded-xl border border-primary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
          >
            Log out
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
          >
            Log in
          </button>
        )}
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#faf6f0] px-6 pb-16 pt-16 sm:px-10 sm:pt-24">
        <svg
          className="pointer-events-none absolute right-[-4rem] top-8 hidden h-64 w-64 text-primary/15 sm:block"
          viewBox="0 0 200 200"
          fill="none"
        >
          <path
            d="M100 10v50M100 60L60 100M100 60l40 40M60 100v60M140 100v60M60 100L30 160M60 100l30 60M140 100l-30 60M140 100l30 60"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="100" cy="10" r="5" fill="currentColor" />
          <circle cx="60" cy="100" r="5" fill="currentColor" />
          <circle cx="140" cy="100" r="5" fill="currentColor" />
          <circle cx="30" cy="160" r="4" fill="currentColor" />
          <circle cx="90" cy="160" r="4" fill="currentColor" />
          <circle cx="110" cy="160" r="4" fill="currentColor" />
          <circle cx="170" cy="160" r="4" fill="currentColor" />
        </svg>

        <div className="relative max-w-2xl">

        {user && <p className="mb-2 text-sm font-medium tracking-wide text-primary">Greetings, {user?.name} !</p>}
          <h1 className="font-serif text-4xl leading-tight text-primary-dark sm:text-5xl">
            Your family's story, mapped out
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-primary-dark/60">
            Build a living family tree together — add parents, children, and
            spouses, keep notes on each person, and watch how everyone
            connects across generations.
          </p>
          {!token && (
            <button
              onClick={() => navigate("/login")}
              className="mt-7 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
            >
              Log in to get started
            </button>
          )}
        </div>
      </section>

      {/* Families — the actual product surface */}
      <section className="border-t border-primary-light bg-white px-6 py-14 sm:px-10">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-2xl text-primary-dark">My families</h2>

          {!token && (
            <div className="mt-4 rounded-xl border border-dashed border-primary-light px-5 py-8 text-center">
              <p className="text-sm text-primary-dark/55">
                Log in to see the families you're part of.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="mt-4 rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
              >
                Log in
              </button>
            </div>
          )}

          {token && isLoading && (
            <div className="mt-6 flex items-center gap-2 text-sm text-primary-dark/50">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-light border-t-primary" />
              Loading your families…
            </div>
          )}

          {token && !isLoading && families?.length === 0 && (
            <p className="mt-6 text-sm text-primary-dark/50">
              You're not part of a family yet — create one below to get started.
            </p>
          )}

          {token && (families?.length ?? 0) > 0 && (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {families?.map((family) => (
                <button
                  key={family.familyId}
                  onClick={() => navigate(`/family/${family.familyId}`)}
                  className="flex items-center justify-between rounded-xl border border-primary-light px-5 py-4 text-left transition-colors hover:border-primary hover:bg-primary-light/30 focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <span className="font-medium text-primary-dark">
                    {family.family.name}
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="text-primary-dark/30"
                  >
                    <path
                      d="M6 3l5 5-5 5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              ))}
            </div>
          )}

          {token && (
            <div className="mt-6">
              {isOpenFamilyForm ? (
                <form onSubmit={handleCreateFamily} className="flex flex-wrap gap-2">
                  <input
                    type="text"
                    placeholder="Family name"
                    name="familyName"
                    onChange={(e) => setFamilyName(e.target.value)}
                    value={familyName}
                    className="flex-1 rounded-lg border border-primary-light px-3 py-2 text-sm text-primary-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isPending ? "Creating…" : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpenFamilyForm(false)}
                    className="rounded-lg border border-primary-light px-4 py-2 text-sm font-medium text-primary-dark/60 transition-colors hover:bg-primary-light/40"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsOpenFamilyForm(true)}
                  className="rounded-xl border border-primary px-5 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
                >
                  + Create family
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-primary-light bg-[#faf6f0] px-6 py-14 sm:px-10">
        <h2 className="text-center font-serif text-2xl text-primary-dark">How it works</h2>
        <div className="mx-auto mt-8 grid max-w-4xl gap-6 sm:grid-cols-3">
          {[
            {
              title: "Add your first person",
              body: "Start with yourself or a relative — name, dates, a short bio.",
            },
            {
              title: "Connect the family",
              body: "Add parents, children, and spouses directly from each person's card.",
            },
            {
              title: "See it come together",
              body: "Watch the tree lay itself out as relationships are added.",
            },
          ].map((step, i) => (
            <div key={step.title} className="rounded-xl border border-primary-light bg-white p-5">
              <span className="font-serif text-sm text-primary/60">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-sm font-medium text-primary-dark">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-primary-dark/55">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About / features */}
      <section className="bg-white px-6 py-14 sm:px-10">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-serif text-2xl text-primary-dark">Why FamilyRoot</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-primary-dark">Built for real families</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-primary-dark/55">
                Support for parents, children, and spouses — including people
                who've passed, with dates kept alongside their story.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-primary-dark">Shared, not solitary</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-primary-dark/55">
                Create a family space and build the tree together, so the
                history isn't sitting on just one person's computer.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-primary-dark">Visual by default</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-primary-dark/55">
                No spreadsheets — every person is a card, every relationship
                is a line you can actually see.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-primary-dark">Yours to control</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-primary-dark/55">
                Roles keep viewers from editing, so the tree stays accurate
                as more people join in.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-primary-light bg-[#faf6f0] px-6 py-8 text-center text-xs text-primary-dark/35 sm:px-10">
        FamilyRoot — build your family's story together.
      </footer>
    </div>
  );
};

export default Dashboard;
