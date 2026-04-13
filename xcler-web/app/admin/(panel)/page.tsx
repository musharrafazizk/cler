import Link from "next/link";
import styles from "@/app/admin/admin.module.css";
import { getBlogPosts, getProjects, getTeamMembers, getTestimonials } from "@/lib/db";

export default async function AdminDashboardPage() {
  let projectsCount = 0;
  let publishedPosts = 0;
  let teamCount = 0;
  let testimonialCount = 0;
  let recentPosts: Awaited<ReturnType<typeof getBlogPosts>> = [];

  try {
    const [projects, blogPosts, teamMembers, testimonials] = await Promise.all([
      getProjects(),
      getBlogPosts(true),
      getTeamMembers(),
      getTestimonials(),
    ]);

    projectsCount = projects.length;
    publishedPosts = blogPosts.length;
    teamCount = teamMembers.length;
    testimonialCount = testimonials.length;
    recentPosts = blogPosts.slice(0, 5);
  } catch {
    // Keep graceful fallback values.
  }

  return (
    <section>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
      </div>

      <div className={styles.stats}>
        <article className={styles.card}>
          <p>Total projects</p>
          <h2>{projectsCount}</h2>
        </article>
        <article className={styles.card}>
          <p>Published blog posts</p>
          <h2>{publishedPosts}</h2>
        </article>
        <article className={styles.card}>
          <p>Team members</p>
          <h2>{teamCount}</h2>
        </article>
        <article className={styles.card}>
          <p>Testimonials</p>
          <h2>{testimonialCount}</h2>
        </article>
      </div>

      <div className={styles.quickLinks}>
        <Link href="/admin/projects">Projects</Link>
        <Link href="/admin/blog">Blog</Link>
        <Link href="/admin/team">Team</Link>
        <Link href="/admin/testimonials">Testimonials</Link>
        <Link href="/admin/settings">Settings</Link>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Published at</th>
              <th>Reading time</th>
            </tr>
          </thead>
          <tbody>
            {recentPosts.map((post) => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>{post.published_at ? new Date(post.published_at).toLocaleString() : "-"}</td>
                <td>{post.reading_time_minutes} min</td>
              </tr>
            ))}
            {recentPosts.length === 0 ? (
              <tr>
                <td colSpan={3}>No published posts yet.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
