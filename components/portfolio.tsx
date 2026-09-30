"use client";

import Image from "next/image";
import { InteractiveEffects } from "@/components/interactive-effects";
import { CopyEmail } from "@/components/copy-email";
import { assetPath } from "@/lib/asset-path";
import { Header } from "@/components/header";
import { Icon } from "@/components/icon";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";
import { useLanguage } from "@/lib/use-language";

export function Portfolio({ cvAvailable }: { cvAvailable: boolean }) {
  const { language, setLanguage, content: c } = useLanguage();
  return (
    <>
      <a className="skip-link" href="#inhoud">
        {c.ui.skipLink}
      </a>
      <Header
        name={c.profile.name}
        initials={c.profile.initials}
        navigation={c.navigation}
        labels={c.ui}
        language={language}
        onLanguageChange={setLanguage}
      />
      <ScrollReveal />
      <InteractiveEffects />
      <main id="inhoud">
        <section id="boven" className="hero" aria-labelledby="hero-title">
          <div className="hero-glow" aria-hidden="true" />
          <div className="container hero-grid">
            <div className="hero-copy">
              {c.profile.availableForWork && (
                <div className="availability">
                  <span />
                  {c.profile.availability}
                </div>
              )}
              <p className="eyebrow hero-eyebrow">{c.hero.eyebrow}</p>
              <h1 id="hero-title">
                {c.profile.firstName}
                <br />
                <span>
                  {c.profile.lastName}
                  <span className="hero-period">.</span>
                </span>
              </h1>
              <p className="hero-role">{c.profile.role}</p>
              <p className="hero-introduction">{c.hero.introduction}</p>
              <div className="hero-buttons">
                <a href="#over-mij" className="button button-primary">
                  {c.ui.aboutMe}
                  <Icon name="arrowUpRight" size={18} />
                </a>
                <a href="#contact" className="button button-secondary">
                  {c.ui.getInTouch}
                  <Icon name="arrowRight" size={18} />
                </a>
                {cvAvailable ? (
                  <a
                    href={assetPath(c.profile.cvPath)}
                    download
                    className="button button-secondary"
                  >
                    <Icon name="download" size={18} />
                    {c.ui.downloadCv}
                  </a>
                ) : (
                  <span className="button cv-unavailable">
                    <Icon name="download" size={18} />
                    {c.ui.cvUnavailable}
                  </span>
                )}
              </div>
            </div>
            <figure className="hero-portrait">
              <div className="portrait-frame">
                <Image
                  src={assetPath(c.profile.photo.src)}
                  alt={c.profile.photo.alt}
                  width={c.profile.photo.width}
                  height={c.profile.photo.height}
                  sizes="(max-width: 767px) calc(100vw - 56px), 420px"
                  preload
                  className="portrait-image"
                />
                <span className="portrait-mark" aria-hidden="true">
                  <Icon name="code" size={24} />
                </span>
              </div>
            </figure>
          </div>
          <div className="container hero-bottom">
            <a href="#over-mij" className="explore-link">
              <span>
                <Icon name="arrowDown" size={17} />
              </span>
              {c.hero.explore}
            </a>
            <a href="#stage" className="current-link">
              <span className="current-icon">
                <Icon name="briefcase" size={19} />
              </span>
              <span>
                <small>{c.hero.currentLabel}</small>
                {c.hero.current}
              </span>
              <Icon name="arrowUpRight" size={17} />
            </a>
          </div>
        </section>

        <section
          id="over-mij"
          className="section container"
          aria-labelledby="about-title"
        >
          <SectionHeading {...c.about} id="about-title" />
          <div className="about-grid">
            <div className="about-copy" data-reveal>
              <h3>{c.about.lead}</h3>
              {c.about.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="traits" data-reveal>
              {c.about.traits.map((trait) => (
                <div className="trait" key={trait.title}>
                  <span className="icon-tile">
                    <Icon name={trait.icon} size={22} />
                  </span>
                  <div>
                    <h3>{trait.title}</h3>
                    <p>{trait.text}</p>
                  </div>
                  <Icon name="arrowUpRight" className="trait-arrow" size={18} />
                </div>
              ))}
            </div>
          </div>
          <article
            id="stage"
            className="internship-card"
            aria-labelledby="internship-title"
            data-reveal
          >
            <div className="internship-main">
              <p className="eyebrow">{c.internship.eyebrow}</p>
              <h3 id="internship-title">{c.internship.title}</h3>
              <div className="company-name">
                {c.internship.company}
                <span className="current-badge">
                  <span />
                  {c.internship.status}
                </span>
              </div>
              <p className="internship-role">{c.internship.role}</p>
              <p className="internship-description">
                {c.internship.description}
              </p>
            </div>
            <div className="internship-details">
              <span className="internship-decoration" aria-hidden="true">
                <Icon name="briefcase" size={26} />
              </span>
              <h4 className="stack-label">{c.internship.periodLabel}</h4>
              <p className="internship-period">{c.internship.period}</p>
              <h4 className="stack-label">{c.internship.stackLabel}</h4>
              <ul className="badges accent-badges">
                {c.internship.stack.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </div>
          </article>
        </section>

        <section
          id="skills"
          className="section section-tinted"
          aria-labelledby="skills-title"
        >
          <div className="container">
            <SectionHeading {...c.skills} id="skills-title" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {c.skills.groups.map((group) => (
                <article className="skill-card" data-reveal key={group.title}>
                  <span className="icon-tile">
                    <Icon name={group.icon} size={23} />
                  </span>
                  <h3>{group.title}</h3>
                  <p>{group.description}</p>
                  <ul className="badges">
                    {group.items.map((skill) => (
                      <li key={skill}>{skill}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="ervaring"
          className="section"
          aria-labelledby="experience-title"
        >
          <div className="container">
            <SectionHeading {...c.experience} id="experience-title" />
            <div className="experience-grid">
              <div data-reveal>
                <h3 className="timeline-heading">
                  <Icon name="briefcase" size={21} />
                  {c.experience.workTitle}
                </h3>
                <div className="timeline">
                  {c.experience.jobs.map((job) => (
                    <article
                      className={`timeline-item ${job.current ? "is-current" : ""}`}
                      key={job.organization}
                    >
                      <span className="timeline-marker" />
                      <p className="timeline-period">{job.period}</p>
                      <h4>{job.title}</h4>
                      <p className="timeline-organization">
                        {job.organization}
                      </p>
                      <p className="timeline-description">{job.description}</p>
                      {job.href && (
                        <a className="text-link" href={job.href}>
                          {job.linkLabel}
                          <Icon name="arrowUpRight" size={15} />
                        </a>
                      )}
                    </article>
                  ))}
                </div>
              </div>
              <div data-reveal>
                <h3 className="timeline-heading">
                  <Icon name="graduation" size={23} />
                  {c.experience.educationTitle}
                </h3>
                <div className="timeline">
                  {c.experience.education.map((education) => (
                    <article
                      className="timeline-item"
                      key={education.organization}
                    >
                      <span className="timeline-marker" />
                      <p className="timeline-period">{education.period}</p>
                      <h4>{education.title}</h4>
                      <p className="timeline-organization">
                        {education.organization}
                      </p>
                      <p className="timeline-description">
                        {education.description}
                      </p>
                      <span className="education-detail">
                        <Icon name="check" size={14} />
                        {education.detail}
                      </span>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="persoonlijk"
          className="section container"
          aria-labelledby="personal-title"
        >
          <SectionHeading {...c.personal} id="personal-title" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {c.personal.hobbies.map((hobby) => (
              <article className="hobby-card" data-reveal key={hobby.title}>
                <Icon name={hobby.icon} size={25} />
                <h3>{hobby.title}</h3>
                <p>{hobby.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="contact"
          className="contact-section container"
          aria-labelledby="contact-title"
        >
          <div className="contact-card" data-reveal>
            <div className="contact-orbit" aria-hidden="true" />
            <span className="contact-icon">
              <Icon name="mail" size={29} />
            </span>
            <p className="eyebrow">{c.contact.eyebrow}</p>
            <h2 id="contact-title">{c.contact.title}</h2>
            <p className="contact-description">{c.contact.description}</p>
            <a
              className="button button-primary"
              href={`mailto:${c.profile.email}`}
            >
              {c.contact.emailLabel}
              <Icon name="arrowUpRight" size={18} />
            </a>
            <a className="contact-email" href={`mailto:${c.profile.email}`}>
              {c.profile.email}
            </a>
            <CopyEmail email={c.profile.email} labels={c.ui} />
            <div className="contact-socials">
              <span>{c.contact.socialLabel}</span>
              <a
                href={c.profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="github" size={17} />
                {c.ui.github}
                <Icon name="arrowUpRight" size={14} />
              </a>
              {c.profile.linkedinUrl && (
                <a
                  href={c.profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name="linkedin" size={17} />
                  {c.ui.linkedin}
                  <Icon name="arrowUpRight" size={14} />
                </a>
              )}
            </div>
          </div>
        </section>
      </main>
      <footer className="container footer">
        <a className="footer-brand" href="#boven">
          {c.profile.name}
          <span>.</span>
          <small>© {new Date().getFullYear()}</small>
        </a>
        <p>{c.footer.note}</p>
        <a href="#boven" className="text-link">
          {c.ui.backToTop}
          <Icon name="arrowUp" size={16} />
        </a>
      </footer>
    </>
  );
}
