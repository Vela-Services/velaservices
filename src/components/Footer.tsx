"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#E2CBAA] py-8 text-center text-sm text-[#7C5E3C]">
      © {new Date().getFullYear()} Vela Services. All rights reserved.
    </footer>
  );
}
