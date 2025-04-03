#!/usr/bin/env python3
import random
from datetime import datetime, timedelta
import git_filter_repo as fr

# Hackathon start and constraints
HACKATHON_START = datetime(2025, 3, 28, 8, 0, 0)  # March 28, 08:00 +0530
TOTAL_COMMITS = 200  # Adjust to your total commit count
COMMITS_PER_DAY = TOTAL_COMMITS // 3  # ~66 commits/day
TIMEZONE_OFFSET = timedelta(hours=5, minutes=30)  # +0530

# Track commit index
commit_index = [0]

def rewrite_commit_callback(commit):
    # Calculate day and time
    day = commit_index[0] // COMMITS_PER_DAY
    day_start = HACKATHON_START + timedelta(days=day)
    commits_today = commit_index[0] % COMMITS_PER_DAY

    # Random interval: 5–15 minutes
    random_interval = random.randint(300, 900)  # seconds
    base_time = day_start + timedelta(seconds=commits_today * random_interval)

    # Adjust for working hours (08:00–11:00, 13:00–23:00)
    hour = base_time.hour + base_time.minute / 60
    if 11 <= hour < 13:  # Lunch break
        base_time = base_time.replace(hour=13, minute=0, second=0) + timedelta(seconds=(hour - 11) * 3600)
    elif hour < 8:  # Before 08:00
        base_time = base_time.replace(hour=8, minute=0, second=0)
    elif hour >= 23:  # After 23:00
        base_time = (day_start + timedelta(days=1)).replace(hour=8, minute=0, second=0)

    # Set new date with timezone
    new_date = base_time.strftime("%Y-%m-%d %H:%M:%S +0530")
    commit.author_date = new_date
    commit.committer_date = new_date
    commit_index[0] += 1

# Apply the filter
fr.FilteringOptions.parse_args(['--commit-callback', 'rewrite_dates.py'])
fr.RepoFilter(fr.FilteringOptions.default_options()).run()