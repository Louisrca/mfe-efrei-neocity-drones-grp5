import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DroneSwarm from "./DroneSwarm";

// Mock du eventBus
vi.mock("shared/eventBus", () => ({
  default: {
    on: vi.fn(() => vi.fn()),
    emit: vi.fn(),
    off: vi.fn(),
  },
}));

import eventBus from "shared/eventBus";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("DroneSwarm Component", () => {
  it("should render GRID formation by default", () => {
    render(<DroneSwarm />);
    expect(screen.getByText(/FORMATION: GRID/i)).toBeInTheDocument();
  });

  it("should render 48 drones", () => {
    render(<DroneSwarm />);
    const drones = document.querySelectorAll(".drone");
    expect(drones).toHaveLength(48);
  });

  it("should render all formation buttons", () => {
    render(<DroneSwarm />);
    const labels = ["grid", "skull", "heart", "x", "chaos", "off"];
    labels.forEach((label) => {
      expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
    });
  });

  it("should mark the active formation button", () => {
    render(<DroneSwarm />);
    expect(screen.getByRole("button", { name: "grid" })).toHaveClass("active");
  });

  // --- Interactions avec boutons ---

  it("should switch to SKULL formation on button click", () => {
    render(<DroneSwarm />);
    fireEvent.click(screen.getByRole("button", { name: "skull" }));
    expect(screen.getByText(/FORMATION: SKULL/i)).toBeInTheDocument();
  });

  it("should switch to HEART formation on button click", () => {
    render(<DroneSwarm />);
    fireEvent.click(screen.getByRole("button", { name: "heart" }));
    expect(screen.getByText(/FORMATION: HEART/i)).toBeInTheDocument();
  });

  it("should switch to OFF formation on button click", () => {
    render(<DroneSwarm />);
    fireEvent.click(screen.getByRole("button", { name: "off" }));
    expect(screen.getByText(/FORMATION: OFF/i)).toBeInTheDocument();
  });

  it("should update active button class on formation change", () => {
    render(<DroneSwarm />);
    fireEvent.click(screen.getByRole("button", { name: "chaos" }));
    expect(screen.getByRole("button", { name: "chaos" })).toHaveClass("active");
    expect(screen.getByRole("button", { name: "grid" })).not.toHaveClass(
      "active",
    );
  });

  it("should apply formation class to all drones", () => {
    render(<DroneSwarm />);
    fireEvent.click(screen.getByRole("button", { name: "skull" }));
    const drones = document.querySelectorAll(".drone.skull");
    expect(drones).toHaveLength(48);
  });

  // --- eventBus emit ---

  it("should emit drone:formation event on formation change", () => {
    render(<DroneSwarm />);
    fireEvent.click(screen.getByRole("button", { name: "heart" }));
    expect(eventBus.emit).toHaveBeenCalledWith("drone:formation", {
      formation: "heart",
    });
  });

  // --- eventBus subscriptions ---

  it("should subscribe to hacker:command, power:outage and power:restore on mount", () => {
    render(<DroneSwarm />);
    expect(eventBus.on).toHaveBeenCalledWith(
      "hacker:command",
      expect.any(Function),
    );
    expect(eventBus.on).toHaveBeenCalledWith(
      "power:outage",
      expect.any(Function),
    );
    expect(eventBus.on).toHaveBeenCalledWith(
      "power:restore",
      expect.any(Function),
    );
  });

  it("should unsubscribe on unmount", () => {
    const unsub = vi.fn();
    eventBus.on.mockReturnValue(unsub);

    const { unmount } = render(<DroneSwarm />);
    unmount();

    expect(unsub).toHaveBeenCalledTimes(3);
  });
});
