import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-200 text-gray-600 py-4 mt-16">
      <div className="text-center text-sm">
        &copy; {new Date().getFullYear()} Voting App. All rights reserved.
      </div>
    </footer>
  );
}
