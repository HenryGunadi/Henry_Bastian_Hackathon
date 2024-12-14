import Image from "next/image";
import localFont from "next/font/local";
import { useEffect, useState } from "react";
import axios from "axios";
import { headers } from "next/headers";
import { useScroll } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex">
      <Button variant="destructive">Hello</Button>
    </div>
  );
}
