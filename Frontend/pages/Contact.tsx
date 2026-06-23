import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Mail, Send, CheckCircle, MessageCircle, Lock, Zap, Users } from "lucide-react";

const trustPoints = [
  { icon: Lock, text: "Secure & private" },
  { icon: Zap, text: "Fast response" },
  { icon: Users, text: "Dedicated support" },
];

const faqs = [
  {
    question: "What is TwinText used for?",
    answer: "TwinText is an all-in-one AI writing assistant that helps you check grammar, detect plagiarism, paraphrase content, detect AI-generated text, and translate to 100+ languages instantly.",
  },
  {
    question: "Is my uploaded content safe?",
    answer: "Absolutely! Your content is encrypted end-to-end and never stored on our servers. We respect your privacy completely and comply with GDPR and other privacy regulations.",
  },
  {
    question: "Can students use TwinText for assignments?",
    answer: "Yes! TwinText is perfect for students. Our plagiarism detector and grammar checker help maintain academic integrity. We support educational use across all our tools.",
  },
  {
    question: "Which languages are supported?",
    answer: "We support 100+ languages including English, Spanish, French, German, Mandarin, Japanese, Arabic, and many more with native-level accuracy.",
  },
  {
    question: "Is there a free plan available?",
    answer: "Yes! We offer a generous free plan with daily credits. Upgrade to Premium for unlimited usage, advanced features, and priority support.",
  },
  {
    question: "How do I cancel my subscription?",
    answer: "You can cancel anytime from your account settings with one click. No questions asked, no hidden fees. Your data will be deleted within 30 days as per request.",
  },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  return (
    <Layout>
      {/* 1️⃣ Hero Section */}
      <section className="relative section-padding bg-gradient-to-br from-primary/10 via-accent/5 to-transparent overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" />
        </div>

        <div className="container-custom relative z-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <MessageCircle className="w-4 h-4 text-primary animate-float" />
            <span className="text-sm font-medium text-primary">Get In Touch</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Let's Connect with <span className="gradient-text">TwinText</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Have questions, feedback, or need support?<br />
            Our team is here to help you write better and faster.
          </p>
        </div>
      </section>


      {/* 3️⃣ Main Contact Form Section */}
      <section className="section-padding bg-secondary/30">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
            {/* Left Column - Text & Trust Points */}
            <div className="flex flex-col justify-start">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                📨 Send Us a Message
              </h2>

              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Fill out the form and our support team will get back to you shortly. We're committed to providing the best support experience.
              </p>

              {/* Trust Points */}
              <div className="space-y-4">
                {trustPoints.map((point, index) => {
                  const Icon = point.icon;
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-medium text-foreground">
                        {point.text}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Decorative element */}
              <div className="mt-12 p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  💡 <span className="font-semibold">Pro Tip:</span> For faster responses, please include as much detail as possible in your message.
                </p>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className="bg-card rounded-2xl p-8 border border-border shadow-lg">
              {submitted ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Message Sent! 🎉</h3>
                  <p className="text-muted-foreground">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Topic / Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="">Select a topic...</option>
                      <option value="support">Support</option>
                      <option value="feature">Feature Request</option>
                      <option value="feedback">Feedback</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="input-field resize-none"
                      placeholder="Tell us how we can help..."
                      rows={5}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary w-full flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300"
                  >
                    <Send className="w-4 h-4" />
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4️⃣ FAQ Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about TwinText features, security, and usage.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`rounded-xl border transition-all duration-300 cursor-pointer ${
                  openFAQ === index
                    ? "bg-card border-primary/30 shadow-lg"
                    : "bg-card/50 border-border hover:border-primary/20 hover:bg-card"
                }`}
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between"
                >
                  <span className="text-left font-semibold text-lg">
                    {faq.question}
                  </span>
                  <span
                    className={`text-primary transition-transform duration-300 flex-shrink-0 ml-4 ${
                      openFAQ === index ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {openFAQ === index && (
                  <div className="px-6 pb-4 border-t border-border/50 animate-slide-up">
                    <p className="text-muted-foreground leading-relaxed mt-4">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>


        </div>
      </section>


    </Layout>
  );
}
