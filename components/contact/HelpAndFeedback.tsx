"use client";

import React, { useState } from "react";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Icon } from "@iconify/react";
import { addToast } from "@heroui/toast";
import { Select, SelectItem } from "@heroui/select";
import { Spacer } from "@heroui/spacer";

interface FeedbackFormData {
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
}

const feedbackCategories = [
  { key: "bug-report", label: "Bug Report" },
  { key: "feature-request", label: "Feature Request" },
  { key: "general-feedback", label: "General Feedback" },
  { key: "account-support", label: "Account Support" },
  { key: "billing-support", label: "Billing Support" },
  { key: "technical-support", label: "Technical Support" },
  { key: "other", label: "Other" },
];

export default function HelpAndFeedback() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FeedbackFormData>({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  });

  const handleInputChange = (field: keyof FeedbackFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      addToast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        color: "danger",
        timeout: 3000,
      });

      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      addToast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        color: "danger",
        timeout: 3000,
      });

      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      addToast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback! We'll get back to you soon.",
        color: "success",
        timeout: 3000,
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        category: "",
        message: "",
      });
    } catch (error) {
      void error;
      addToast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        color: "danger",
        timeout: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl p-6">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-neutral-800 p-3">
            <Icon
              className="text-neutral-300"
              icon="mdi:help-circle"
              width={26}
            />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-neutral-100">Help & Feedback</h1>
        <p className="mt-4 text-lg text-neutral-400">
          Get help, share feedback, or report issues. We&apos;re here to help!
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left Column - Contact Info */}
        <div className="space-y-6">
          <Card className="bg-transparent shadow-none">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Icon
                  className="text-neutral-300"
                  icon="mdi:contact-mail"
                  width={24}
                />
                <h2 className="text-xl font-semibold text-neutral-100">
                  Contact Information
                </h2>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex items-center gap-3">
                <Icon
                  className="text-neutral-400"
                  icon="mdi:email"
                  width={20}
                />
                <div>
                  <p className="text-sm font-medium text-neutral-200">Email</p>
                  <p className="text-sm text-neutral-400">support@t1gpt.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Icon
                  className="text-neutral-400"
                  icon="mdi:clock"
                  width={20}
                />
                <div>
                  <p className="text-sm font-medium text-neutral-200">
                    Response Time
                  </p>
                  <p className="text-sm text-neutral-400">
                    Usually within 24 hours
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Additional Info */}
          <div className="rounded-lg border border-neutral-700/50 bg-neutral-900/30 p-4">
            <div className="flex items-start gap-3">
              <Icon
                className="mt-1 text-neutral-400"
                icon="mdi:information"
                width={18}
              />
              <div>
                <p className="mb-1 text-sm font-medium text-neutral-200">
                  Need immediate help?
                </p>
                <p className="text-xs leading-relaxed text-neutral-400">
                  Check our documentation or join our community for quick
                  answers to common questions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Feedback Form */}
        <div>
          <Card className="border border-neutral-700 bg-neutral-900/30 p-3 shadow-none">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Icon
                  className="text-neutral-300"
                  icon="mdi:message-text"
                  width={24}
                />
                <div>
                  <h2 className="text-xl font-semibold text-neutral-100">
                    Send Feedback
                  </h2>
                  <p className="text-sm text-neutral-400">
                    Help us improve by sharing your thoughts
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Name and Email */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    isRequired
                    classNames={{
                      input: "bg-neutral-800 border-neutral-600",
                      inputWrapper:
                        "bg-neutral-800 border-neutral-600 hover:border-neutral-500",
                    }}
                    label="Name"
                    placeholder="Your full name"
                    startContent={
                      <Icon
                        className="text-neutral-400"
                        icon="mdi:account"
                        width={20}
                      />
                    }
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                  <Input
                    isRequired
                    classNames={{
                      input: "bg-neutral-800 border-neutral-600",
                      inputWrapper:
                        "bg-neutral-800 border-neutral-600 hover:border-neutral-500",
                    }}
                    label="Email"
                    placeholder="your.email@example.com"
                    startContent={
                      <Icon
                        className="text-neutral-400"
                        icon="mdi:email"
                        width={20}
                      />
                    }
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>

                {/* Subject */}
                <Input
                  classNames={{
                    input: "bg-neutral-800 border-neutral-600",
                    inputWrapper:
                      "bg-neutral-800 border-neutral-600 hover:border-neutral-500",
                  }}
                  label="Subject"
                  placeholder="Brief description of your feedback"
                  startContent={
                    <Icon
                      className="text-neutral-400"
                      icon="mdi:format-title"
                      width={20}
                    />
                  }
                  value={formData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                />

                {/* Category */}
                <Select
                  classNames={{
                    trigger:
                      "bg-neutral-800 border-neutral-600 hover:border-neutral-500",
                  }}
                  label="Category"
                  placeholder="Select a category"
                  selectedKeys={formData.category ? [formData.category] : []}
                  startContent={
                    <Icon
                      className="text-neutral-400"
                      icon="mdi:tag"
                      width={20}
                    />
                  }
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] as string;

                    handleInputChange("category", selectedKey || "");
                  }}
                >
                  {feedbackCategories.map((category) => (
                    <SelectItem key={category.key}>{category.label}</SelectItem>
                  ))}
                </Select>

                {/* Message */}
                <Textarea
                  isRequired
                  classNames={{
                    input: "bg-neutral-800 border-neutral-600",
                    inputWrapper:
                      "bg-neutral-800 border-neutral-600 hover:border-neutral-500",
                  }}
                  description="Please provide as much detail as possible"
                  label="Message"
                  maxRows={8}
                  minRows={4}
                  placeholder="Tell us about your experience, suggestions, or any issues you've encountered..."
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                />

                <Spacer y={2} />

                {/* Submit Button */}
                <Button
                  fullWidth
                  className="bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
                  isLoading={isLoading}
                  size="lg"
                  startContent={
                    !isLoading && <Icon icon="mdi:send" width={20} />
                  }
                  type="submit"
                >
                  {isLoading ? "Sending Feedback..." : "Send Feedback"}
                </Button>
              </form>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
