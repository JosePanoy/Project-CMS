import React from "react";
import '../src/assets/css/about.css';
import Navbar from "./navbar";

function About() {
    return (
        <>
            <Navbar />
            <div className="about-container">
                <h2 className="about-title">About Us</h2>
                <section className="about-section">
                    <p>
                        At SocialMediaClone, our mission is to connect people and foster meaningful relationships through
                        an innovative and user-friendly social media platform. We aim to provide a space where users can
                        share their thoughts, experiences, and connect with others around the world.
                    </p>
                </section>
                <section className="about-section">
                    <h3>Our Vision</h3>
                    <p>
                        Our vision is to create a vibrant and inclusive online community where individuals from all walks
                        of life can engage, learn, and grow together. We are committed to enhancing the social experience
                        with cutting-edge technology and a focus on user satisfaction.
                    </p>
                </section>
                <section className="about-section">
                    <h3>Our Values</h3>
                    <p>
                        We believe in transparency, respect, and innovation. Our values guide us in delivering a platform
                        that is secure, user-centric, and continuously evolving to meet the needs of our community. We
                        prioritize the privacy and safety of our users while striving to create a positive and engaging
                        environment.
                    </p>
                </section>
                <section className="about-section">
                    <h3>Contact Us</h3>
                    <p>
                        We welcome feedback and inquiries from our users. If you have any questions or suggestions, please
                        reach out to us at contact@josepanoy/vercel/app. We are always here to assist you and appreciate
                        your input as we continue to improve our platform.
                    </p>
                </section>
            </div>
        </>
    );
}

export default About;
