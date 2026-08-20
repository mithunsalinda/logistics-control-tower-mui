import { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router';

import {
  BalanceRounded,
  BarChartRounded,
  FactoryRounded,
  PlayArrowRounded,
  SwapHorizRounded,
  TrendingDownRounded,
  TrendingUpRounded,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  Typography,
  type SelectChangeEvent,
} from '@mui/material';

import type { RegionCode } from '../../config/regions';
import {
  useGetCapacityForecastsQuery,
  useGetCapacityScenariosQuery,
  type CapacityForecast,
  type CapacityScenario,
} from '../../store';
import { getDataRegion } from '../../utils/regionFilters';
import OperationsHeader from '../dashboard/OperationsHeader';
import {
  capacityProgressSx,
  capacityStyles,
  chipSx,
  comparisonCardSx,
  forecastCardSx,
  metricCardSx,
  metricValueSx,
  scenarioOptionSx,
  tonePalette,
} from './Capacity.styles';

const horizonOptions = [7, 14, 30] as const;

export default function Capacity() {
  const { region } = useOutletContext<{ region: RegionCode }>();
  const selectedDataRegion = getDataRegion(region);
  const { data: forecasts = [], isFetching } = useGetCapacityForecastsQuery();
  const { data: scenarios = [] } = useGetCapacityScenariosQuery();
  const [horizonDays, setHorizonDays] = useState<(typeof horizonOptions)[number]>(7);
  const [selectedScenarioIds, setSelectedScenarioIds] = useState<string[]>([]);
  const [comparisonRan, setComparisonRan] = useState(false);

  const regionForecasts = useMemo(
    () =>
      forecasts
        .filter((forecast) => forecast.region === selectedDataRegion && forecast.horizonDays <= horizonDays)
        .sort((left, right) => getVariance(left) - getVariance(right)),
    [forecasts, horizonDays, selectedDataRegion],
  );

  const regionScenarios = useMemo(
    () =>
      scenarios
        .filter((scenario) => scenario.region === selectedDataRegion && scenario.horizonDays <= horizonDays)
        .sort((left, right) => right.shortfallReduction - left.shortfallReduction),
    [horizonDays, scenarios, selectedDataRegion],
  );

  const selectedScenarios = regionScenarios.filter((scenario) => selectedScenarioIds.includes(scenario.id));
  const shortfalls = regionForecasts.filter((forecast) => forecast.capacity < forecast.demand);
  const surpluses = regionForecasts.filter((forecast) => forecast.capacity >= forecast.demand);
  const totalDemand = sum(regionForecasts.map((forecast) => forecast.demand));
  const totalCapacity = sum(regionForecasts.map((forecast) => forecast.capacity));
  const netVariance = totalCapacity - totalDemand;

  const handleScenarioToggle = (scenarioId: string) => {
    setComparisonRan(false);
    setSelectedScenarioIds((current) =>
      current.includes(scenarioId)
        ? current.filter((id) => id !== scenarioId)
        : [...current, scenarioId].slice(-3),
    );
  };

  return (
    <Stack spacing={3} sx={capacityStyles.root}>
      <OperationsHeader
        pageName="Capacity Outlook"
        liveUpdate={false}
        title="CAPACITY FORECASTING & PLANNING"
        desc={`Forecast demand against capacity by region, lane and facility in ${selectedDataRegion}.`}
      />

      <Box sx={capacityStyles.metricsGrid}>
        <MetricCard label="Forecast records" value={isFetching ? '...' : String(regionForecasts.length)} tone="blue" />
        <MetricCard label="Shortfalls" value={String(shortfalls.length)} tone="red" />
        <MetricCard label="Surpluses" value={String(surpluses.length)} tone="green" />
        <MetricCard label="Net variance" value={`${netVariance > 0 ? '+' : ''}${netVariance}%`} tone={netVariance < 0 ? 'red' : 'green'} />
      </Box>

      <Box sx={capacityStyles.horizonBar}>
        <Stack direction="row" spacing={1} sx={capacityStyles.iconRow}>
          <BarChartRounded sx={capacityStyles.iconAccent} />
          <Box>
            <Typography sx={capacityStyles.horizonTitle}>
              Forecast horizon
            </Typography>
            <Typography sx={capacityStyles.mutedText}>
              Region is controlled from the top header.
            </Typography>
          </Box>
        </Stack>
        <Select
          value={String(horizonDays)}
          onChange={(event: SelectChangeEvent) => setHorizonDays(Number(event.target.value) as (typeof horizonOptions)[number])}
          sx={capacityStyles.horizonSelect}
        >
          {horizonOptions.map((option) => (
            <MenuItem key={option} value={String(option)}>
              Next {option} days
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Box sx={capacityStyles.contentGrid}>
        <ForecastPanel forecasts={regionForecasts} />
        <ScenarioPanel
          comparisonRan={comparisonRan}
          scenarios={regionScenarios}
          selectedScenarios={selectedScenarios}
          selectedScenarioIds={selectedScenarioIds}
          onRunComparison={() => setComparisonRan(true)}
          onScenarioToggle={handleScenarioToggle}
        />
      </Box>
    </Stack>
  );
}

function ForecastPanel({ forecasts }: { forecasts: CapacityForecast[] }) {
  return (
    <Box sx={capacityStyles.panel}>
      <Stack direction="row" spacing={1} sx={capacityStyles.panelHeader}>
        <FactoryRounded sx={capacityStyles.iconAccent} />
        <Box>
          <Typography sx={capacityStyles.eyebrow}>
            REGION, LANE & FACILITY
          </Typography>
          <Typography sx={capacityStyles.panelTitle}>
            Capacity Forecast
          </Typography>
        </Box>
      </Stack>

      <Stack spacing={1.2}>
        {forecasts.length === 0 ? (
          <Box sx={capacityStyles.emptyState}>
            <Typography sx={capacityStyles.emptyText}>
              No capacity forecasts for this region and horizon.
            </Typography>
          </Box>
        ) : (
          forecasts.map((forecast) => <ForecastCard key={forecast.id} forecast={forecast} />)
        )}
      </Stack>
    </Box>
  );
}

function ForecastCard({ forecast }: { forecast: CapacityForecast }) {
  const variance = getVariance(forecast);
  const color = variance < 0 ? tonePalette.red : tonePalette.green;

  return (
    <Box
      sx={forecastCardSx(color, variance < 0)}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={1}
        sx={capacityStyles.forecastHeader}
      >
        <Box>
          <Typography sx={capacityStyles.forecastLane}>
            {forecast.origin} to {forecast.destination}
          </Typography>
          <Typography sx={capacityStyles.forecastMeta}>
            {forecast.facility} / {forecast.facilityCode} / {forecast.horizonDays} days
          </Typography>
        </Box>
        <Stack direction="row" spacing={0.7} sx={capacityStyles.chipRow}>
          <Chip
            icon={variance < 0 ? <TrendingDownRounded /> : <TrendingUpRounded />}
            label={variance < 0 ? `Shortfall ${Math.abs(variance)}%` : `Surplus ${variance}%`}
            sx={chipSx(color)}
          />
          <Chip label={`${forecast.direction === 'down' ? 'Down' : 'Up'} ${forecast.trend}%`} />
        </Stack>
      </Stack>

      <CapacityBar label="Demand" value={forecast.demand} color="#d66b29" />
      <CapacityBar label="Capacity" value={forecast.capacity} color="#159d95" />
    </Box>
  );
}

function CapacityBar({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <Box sx={capacityStyles.barRoot}>
      <Stack direction="row" sx={capacityStyles.barHeader}>
        <Typography sx={capacityStyles.barLabel}>{label}</Typography>
        <Typography sx={capacityStyles.barValue}>{value}%</Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={value}
        sx={capacityProgressSx(color)}
      />
    </Box>
  );
}

function ScenarioPanel({
  comparisonRan,
  onRunComparison,
  onScenarioToggle,
  scenarios,
  selectedScenarioIds,
  selectedScenarios,
}: {
  comparisonRan: boolean;
  onRunComparison: () => void;
  onScenarioToggle: (value: string) => void;
  scenarios: CapacityScenario[];
  selectedScenarioIds: string[];
  selectedScenarios: CapacityScenario[];
}) {
  return (
    <Stack spacing={2}>
      <Box
        sx={capacityStyles.panel}
      >
        <Stack direction="row" spacing={1} sx={capacityStyles.scenarioPanelHeader}>
          <SwapHorizRounded sx={capacityStyles.iconAccent} />
          <Box>
            <Typography sx={capacityStyles.eyebrow}>
              SERVICE RETURNED WHAT-IF OPTIONS
            </Typography>
            <Typography sx={capacityStyles.panelTitle}>
              Scenario Selection
            </Typography>
          </Box>
        </Stack>

        <Stack spacing={1}>
          {scenarios.map((scenario) => (
            <Box
              key={scenario.id}
              component="button"
              onClick={() => onScenarioToggle(scenario.id)}
              sx={scenarioOptionSx(selectedScenarioIds.includes(scenario.id))}
            >
              <Typography sx={capacityStyles.forecastLane}>
                {scenario.name}
              </Typography>
              <Typography sx={capacityStyles.mutedText}>
                {scenario.description}
              </Typography>
              <Stack direction="row" spacing={0.7} sx={capacityStyles.chipRow}>
                <Chip size="small" label={`${scenario.horizonDays} days`} />
                <Chip size="small" label={`+${scenario.addedCapacity}% capacity`} />
                <Chip size="small" label={`Cost ${formatCurrency(scenario.costImpactUsd)}`} />
              </Stack>
            </Box>
          ))}
        </Stack>

        <Button
          fullWidth
          variant="contained"
          startIcon={<PlayArrowRounded />}
          disabled={selectedScenarios.length === 0}
          onClick={onRunComparison}
          sx={capacityStyles.runButton}
        >
          Run comparison
        </Button>
      </Box>

      <ComparisonPanel comparisonRan={comparisonRan} scenarios={selectedScenarios} />
    </Stack>
  );
}

function ComparisonPanel({
  comparisonRan,
  scenarios,
}: {
  comparisonRan: boolean;
  scenarios: CapacityScenario[];
}) {
  return (
    <Box sx={capacityStyles.panel}>
      <Stack direction="row" spacing={1} sx={capacityStyles.comparisonHeader}>
        <BalanceRounded sx={capacityStyles.iconAccent} />
        <Typography sx={capacityStyles.comparisonTitle}>
          Scenario Comparison
        </Typography>
      </Stack>

      {!comparisonRan ? (
        <Typography sx={capacityStyles.mutedText}>
          Select one or more scenarios and run comparison.
        </Typography>
      ) : (
        <Stack spacing={1}>
          {scenarios.map((scenario) => (
            <Box key={scenario.id} sx={comparisonCardSx()}>
              <Typography sx={capacityStyles.forecastLane}>
                {scenario.name}
              </Typography>
              <Box sx={capacityStyles.comparisonMetricGrid}>
                <MiniMetric label="Projected OTD" value={`${scenario.projectedOtd}%`} />
                <MiniMetric label="Cost impact" value={formatCurrency(scenario.costImpactUsd)} />
                <MiniMetric label="At-risk reduced" value={String(scenario.atRiskReduction)} />
                <MiniMetric label="Shortfall reduced" value={`${scenario.shortfallReduction}%`} />
              </Box>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={capacityStyles.miniMetric}>
      <Typography sx={capacityStyles.miniMetricLabel}>{label}</Typography>
      <Typography sx={capacityStyles.miniMetricValue}>{value}</Typography>
    </Box>
  );
}

function MetricCard({
  label,
  tone,
  value,
}: {
  label: string;
  tone: 'blue' | 'green' | 'red';
  value: string;
}) {
  const color = tonePalette[tone];

  return (
    <Box
      sx={metricCardSx(color)}
    >
      <Typography sx={capacityStyles.metricLabel}>{label}</Typography>
      <Typography sx={metricValueSx(color)}>{value}</Typography>
    </Box>
  );
}

function getVariance(forecast: CapacityForecast) {
  return forecast.capacity - forecast.demand;
}

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}
