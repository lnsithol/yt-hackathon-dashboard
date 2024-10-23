"use client";

import { useState, useRef, useEffect } from "react";
import {
  Menu,
  X,
  BarChart2,
  PieChart,
  Users,
  Smile,
  Hash,
  Cloud,
  ChevronRight,
  Search,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  PieChart as RechartsePieChart,
  Cell,
  ResponsiveContainer,
  Bar,
  Pie,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ApiEndpoints {
  [key: string]: string;
}

const API_ENDPOINTS_URL = "http://127.0.0.1:5328";
const API_ENDPOINTS: ApiEndpoints = {
  wordCloud: API_ENDPOINTS_URL + "/api/word-frequency",
  wordFrequency: API_ENDPOINTS_URL + "/api/word-frequency",
  sentimentDistribution: API_ENDPOINTS_URL + "/api/sentiment-distribution",
  namedEntities: API_ENDPOINTS_URL + "/api/named-entities",
  averageSentiment: API_ENDPOINTS_URL + "/api/average-sentiment",
  topicModeling: API_ENDPOINTS_URL + "/api/topic-modeling",
  timeSeries: API_ENDPOINTS_URL + "/api/time-series",
  rawData: API_ENDPOINTS_URL + "/api/raw-data",
  summaryStatistics: API_ENDPOINTS_URL + "/api/summary-statistics",
};

type WordFrequency = [string, number];

interface Transcript {
  video_id: string;
  transcript: string;
}

interface TranscriptViewerProps {
  transcripts?: Transcript[];
}

interface SentimentDistribution {
  [key: string]: number;
}

type NamedEntity = [string, string];
type NamedEntityWithCount = [NamedEntity, number];

interface AverageSentiment {
  neg: number;
  neu: number;
  pos: number;
  compound: number;
}

type TopicModeling = string[];

type DataType =
  | WordFrequency[]
  | SentimentDistribution
  | NamedEntity[]
  | AverageSentiment
  | TopicModeling;

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeData, setActiveData] = useState<DataType | null>(null);
  const [activeEndpoint, setActiveEndpoint] = useState<string>("");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const fetchData = async (endpoint: string) => {
    setLoading(true);
    setActiveEndpoint(endpoint);
    try {
      const response = await fetch(API_ENDPOINTS[endpoint]);
      const data = await response.json();
      console.log(data);
      setActiveData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setActiveData(null);
    }
    setLoading(false);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (!activeData) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-xl text-muted-foreground">
            Select an API endpoint to visualize data
            {/* <DisplayTranscript /> */}
          </p>
        </div>
      );
    }

    switch (activeEndpoint) {
      case "wordFrequency":
        return <WordFrequencyChart data={activeData as WordFrequency[]} />;
      case "sentimentDistribution":
        return (
          <SentimentDistributionChart
            data={activeData as SentimentDistribution}
          />
        );
      case "namedEntities":
        return <NamedEntitiesTable data={activeData as NamedEntity[]} />;
      case "averageSentiment":
        return <AverageSentimentCard data={activeData as AverageSentiment} />;
      case "topicModeling":
        return <TopicModelingCard data={activeData as TopicModeling} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <BarChart2 className="h-6 w-6" />
              <span className="hidden font-bold sm:inline-block">
                YTube Data Visualizer
              </span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link href="/">Home</Link>
              <Link href="/about">About</Link>
              <Link href="/api-docs">API Documentation</Link>
            </nav>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="mr-2 md:hidden"
            onClick={toggleSidebar}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </header>
      <div className="flex flex-1">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:relative md:translate-x-0`}
        >
          <div className="h-full bg-muted/40 p-4">
            <div className="flex justify-end md:hidden">
              <Button variant="outline" size="icon" onClick={toggleSidebar}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <nav className="space-y-2 mt-4">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => fetchData("wordFrequency")}
              >
                <BarChart2 className="mr-2 h-4 w-4" />
                Word Frequency
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => fetchData("sentimentDistribution")}
              >
                <PieChart className="mr-2 h-4 w-4" />
                Sentiment Distribution
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => fetchData("namedEntities")}
              >
                <Users className="mr-2 h-4 w-4" />
                Named Entities
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => fetchData("averageSentiment")}
              >
                <Smile className="mr-2 h-4 w-4" />
                Average Sentiment
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => fetchData("topicModeling")}
              >
                <Hash className="mr-2 h-4 w-4" />
                Topic Modeling
              </Button>
            </nav>
          </div>
        </aside>
        <main className="flex-1 p-6 overflow-auto">{renderContent()}</main>
      </div>
      <footer className="border-t py-6 px-6 md:px-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2023 Data Visualization Dashboard. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground"
            >
              Twitter
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground"
            >
              GitHub
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground"
            >
              LinkedIn
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function WordFrequencyChart({ data }: { data: WordFrequency[] }) {
  const chartData = data.map(([word, frequency]) => ({ word, frequency }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Word Frequency</CardTitle>
        <CardDescription>Top 20 most frequent words</CardDescription>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="word" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="frequency" fill="hsl(var(--primary))" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function NamedEntitiesTable({ data }: { data: NamedEntityWithCount[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Named Entities</CardTitle>
        <CardDescription>
          Top named entities, their labels, and counts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Entity</TableHead>
              <TableHead>Label</TableHead>
              <TableHead>Count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(([[entity, label], count], index) => (
              <TableRow key={index}>
                <TableCell>{entity}</TableCell>
                <TableCell>{label}</TableCell>
                <TableCell>{count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function AverageSentimentCard({ data }: { data: AverageSentiment }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Average Sentiment</CardTitle>
        <CardDescription>Overall sentiment scores</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Negative</TableCell>
              <TableCell>{data.neg.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Neutral</TableCell>
              <TableCell>{data.neu.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Positive</TableCell>
              <TableCell>{data.pos.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Compound</TableCell>
              <TableCell>{data.compound.toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function SentimentDistributionChart({ data }: { data: SentimentDistribution }) {
  const chartData = Object.entries(data).map(([sentiment, value]) => ({
    sentiment,
    value,
  }));
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentiment Distribution</CardTitle>
        <CardDescription>
          Distribution of positive, negative, and neutral sentiments
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsePieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="sentiment"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </RechartsePieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function TopicModelingCard({ data }: { data: TopicModeling }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Topic Modeling</CardTitle>
        <CardDescription>Top topics and their key words</CardDescription>
      </CardHeader>
      <CardContent>
        {data.map((topic, index) => (
          <div key={index} className="mb-4">
            <h3 className="font-semibold">Topic {index + 1}</h3>
            <p>{topic.split(": ")[1]}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
