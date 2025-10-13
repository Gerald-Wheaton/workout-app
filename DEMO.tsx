function WorkoutViewWithHistory() {
    const [completedSets, setCompletedSets] = useState([true, true, false, false])
    const [currentExercise, setCurrentExercise] = useState(0)
    const [exerciseSheetOpen, setExerciseSheetOpen] = useState(false)
    const [menuSheetOpen, setMenuSheetOpen] = useState(false)
    const [weightDialogOpen, setWeightDialogOpen] = useState(false)
    const [customWeight, setCustomWeight] = useState("")
  
    const [selectedSet, setSelectedSet] = useState(2)
  
    const [setData, setSetData] = useState([
      { weight: 145, reps: 8 },
      { weight: 145, reps: 8 },
      { weight: 145, reps: 8 },
      { weight: 145, reps: 8 },
    ])
  
    const [exercises, setExercises] = useState([
      { name: "Chest Flyes", setsCompleted: 0, totalSets: 4 },
      { name: "Bench Press", setsCompleted: 4, totalSets: 4 },
      { name: "Incline Press", setsCompleted: 4, totalSets: 4 },
      { name: "Cable Crossover", setsCompleted: 2, totalSets: 4 },
      { name: "Dumbbell Pullover", setsCompleted: 0, totalSets: 4 },
      { name: "Push-Ups", setsCompleted: 3, totalSets: 4 },
    ])
  
    const numCompletedSets = completedSets.filter(Boolean).length
    const allSetsComplete = completedSets.every(Boolean)
    const isViewingPastSet = selectedSet < numCompletedSets
  
    const updateWeight = (newWeight: number) => {
      const newSetData = [...setData]
      newSetData[selectedSet] = { ...newSetData[selectedSet], weight: newWeight }
      setSetData(newSetData)
    }
  
    const updateReps = (newReps: number) => {
      const newSetData = [...setData]
      newSetData[selectedSet] = { ...newSetData[selectedSet], reps: newReps }
      setSetData(newSetData)
    }
  
    const handleSetAction = () => {
      if (isViewingPastSet) {
        // Save the changes and jump back to current set
        const nextIncompleteIndex = completedSets.findIndex((completed) => !completed)
        if (nextIncompleteIndex !== -1) {
          setSelectedSet(nextIncompleteIndex)
        } else {
          // All sets complete, go to last set
          setSelectedSet(completedSets.length - 1)
        }
      } else if (!allSetsComplete) {
        // Complete the current set
        const nextIncompleteIndex = completedSets.findIndex((completed) => !completed)
        if (nextIncompleteIndex !== -1) {
          const newCompletedSets = [...completedSets]
          newCompletedSets[nextIncompleteIndex] = true
          setCompletedSets(newCompletedSets)
          if (nextIncompleteIndex < completedSets.length - 1) {
            setSelectedSet(nextIncompleteIndex + 1)
          }
        }
      } else {
        // Move to next exercise
        if (currentExercise < exercises.length - 1) {
          setCurrentExercise(currentExercise + 1)
          setCompletedSets([false, false, false, false])
          setSelectedSet(0)
          setSetData([
            { weight: 145, reps: 8 },
            { weight: 145, reps: 8 },
            { weight: 145, reps: 8 },
            { weight: 145, reps: 8 },
          ])
        }
      }
    }
  
    const handleWeightSelect = (weight: number) => {
      updateWeight(weight)
      setWeightDialogOpen(false)
      setCustomWeight("")
    }
  
    const handleCustomWeightSubmit = () => {
      const weight = Number.parseInt(customWeight)
      if (!isNaN(weight) && weight > 0) {
        handleWeightSelect(weight)
      }
    }
  
    const currentWeight = setData[selectedSet].weight
  
    const handleDeleteExercise = (index: number) => {
      const newExercises = exercises.filter((_, i) => i !== index)
      setExercises(newExercises)
      if (currentExercise >= newExercises.length) {
        setCurrentExercise(Math.max(0, newExercises.length - 1))
      }
    }
  
    const handleUpdateExercise = (index: number, name: string, totalSets: number) => {
      const newExercises = [...exercises]
      newExercises[index] = { ...newExercises[index], name, totalSets }
      setExercises(newExercises)
    }
  
    return (
      <div className="flex min-h-screen flex-col bg-background">
        {/* Header */}
        <header className="flex items-center justify-between p-4">
          <Sheet open={menuSheetOpen} onOpenChange={setMenuSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-12 w-12">
                <Menu className="h-7 w-7" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <nav className="flex flex-col gap-4 pt-8">
                <Button variant="ghost" className="justify-start gap-3 text-lg" onClick={() => setMenuSheetOpen(false)}>
                  <Home className="h-5 w-5" />
                  Home
                </Button>
                <Button variant="ghost" className="justify-start gap-3 text-lg" onClick={() => setMenuSheetOpen(false)}>
                  <Dumbbell className="h-5 w-5" />
                  Routines
                </Button>
                <Button variant="ghost" className="justify-start gap-3 text-lg" onClick={() => setMenuSheetOpen(false)}>
                  <Settings className="h-5 w-5" />
                  Settings
                </Button>
                <Button variant="ghost" className="justify-start gap-3 text-lg" onClick={() => setMenuSheetOpen(false)}>
                  <BarChart3 className="h-5 w-5" />
                  Dashboard
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
  
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder.svg" alt="Profile" />
              <AvatarFallback className="bg-muted">
                <User className="h-5 w-5 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
          </div>
        </header>
  
        {/* Progress Bar */}
        <div className="px-4">
          <Progress value={60} className="h-1" />
        </div>
  
        <div className="relative mt-8">
          <div className="text-center text-3xl font-light text-muted-foreground">2:15</div>
  
          {isViewingPastSet && (
            <div className="absolute left-0 right-0 top-full mt-2 text-center text-sm font-medium text-blue-600">
              Viewing Set {selectedSet + 1} (Past Set)
            </div>
          )}
        </div>
  
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="text-lg font-normal text-foreground">{exercises[currentExercise].name}</div>
  
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setWeightDialogOpen(true)}
                className="text-[80px] font-bold leading-none tracking-tight text-foreground hover:text-foreground/80 active:text-foreground/60 transition-colors"
              >
                {setData[selectedSet].weight}
              </button>
              <span className="text-3xl text-muted-foreground">×</span>
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={() => updateReps(setData[selectedSet].reps + 1)}
                  className="text-muted-foreground hover:text-foreground active:text-foreground"
                >
                  <ChevronUp className="h-5 w-5" />
                </button>
                <span className="text-5xl font-bold text-foreground">{setData[selectedSet].reps}</span>
                <button
                  onClick={() => updateReps(Math.max(1, setData[selectedSet].reps - 1))}
                  className="text-muted-foreground hover:text-foreground active:text-foreground"
                >
                  <ChevronDown className="h-5 w-5" />
                </button>
              </div>
            </div>
  
            <div className="text-sm text-muted-foreground">lbs × reps</div>
          </div>
        </div>
  
        <div className="relative flex justify-center py-12">
          <div className="relative h-16 w-64">
            {completedSets.map((completed, index) => {
              const isClickable = index <= numCompletedSets
              const numSets = completedSets.length
  
              // Calculate position along a circular arc (bowl shape)
              const arcAngle = 120 // Total arc span in degrees
              const startAngle = -60 // Start angle (left side)
              const radius = 80 // Radius of the arc
  
              // Calculate angle for this dot
              const angle = startAngle + (index / (numSets - 1)) * arcAngle
              const angleRad = (angle * Math.PI) / 180
  
              // Calculate x and y positions
              const x = radius * Math.sin(angleRad)
              const y = radius * (1 - Math.cos(angleRad))
  
              return (
                <button
                  key={index}
                  onClick={() => isClickable && setSelectedSet(index)}
                  disabled={!isClickable}
                  className={`absolute flex h-11 w-11 items-center justify-center rounded-full transition-all ${
                    isClickable ? "hover:bg-muted active:bg-muted" : "cursor-not-allowed"
                  }`}
                  style={{
                    left: `calc(50% + ${x}px - 1.375rem)`, // 1.375rem = half of 11 (w-11)
                    top: `${y}px`,
                  }}
                  aria-label={`Set ${index + 1}`}
                >
                  <div
                    className={`h-3 w-3 rounded-full transition-all ${
                      selectedSet === index && isClickable ? "ring-2 ring-blue-500 ring-offset-2" : ""
                    } ${completed ? "bg-foreground" : "bg-muted"}`}
                  />
                </button>
              )
            })}
          </div>
        </div>
  
        <Sheet open={exerciseSheetOpen} onOpenChange={setExerciseSheetOpen}>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="fixed bottom-32 right-6 h-14 w-14 rounded-full bg-foreground shadow-lg hover:bg-foreground/90"
            >
              <Edit className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-auto max-h-[80vh]">
            <div className="flex flex-col px-6 py-6">
              <h3 className="mb-6 text-lg font-semibold">Select Exercise</h3>
              <div className="flex max-h-[60vh] flex-col gap-2 overflow-y-auto pr-2">
                {exercises.map((exercise, index) => (
                  <SwipeableExerciseCard
                    key={index}
                    exercise={exercise}
                    index={index}
                    currentExercise={currentExercise}
                    onSelect={() => {
                      setCurrentExercise(index)
                      setExerciseSheetOpen(false)
                    }}
                    onDelete={() => handleDeleteExercise(index)}
                    onUpdate={(name, totalSets) => handleUpdateExercise(index, name, totalSets)}
                  />
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
  
        <Dialog open={weightDialogOpen} onOpenChange={setWeightDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Select Weight</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-2 py-4">
              {currentWeight > 5 && (
                <Button
                  variant="outline"
                  className="h-14 text-lg justify-start bg-transparent"
                  onClick={() => handleWeightSelect(currentWeight - 5)}
                >
                  {currentWeight - 5} lbs
                </Button>
              )}
              <Button
                variant="default"
                className="h-14 text-lg justify-start"
                onClick={() => handleWeightSelect(currentWeight)}
              >
                {currentWeight} lbs (Current)
              </Button>
              <Button
                variant="outline"
                className="h-14 text-lg justify-start bg-transparent"
                onClick={() => handleWeightSelect(currentWeight + 5)}
              >
                {currentWeight + 5} lbs
              </Button>
              <Button
                variant="outline"
                className="h-14 text-lg justify-start bg-transparent"
                onClick={() => handleWeightSelect(currentWeight + 10)}
              >
                {currentWeight + 10} lbs
              </Button>
              <Button
                variant="outline"
                className="h-14 text-lg justify-start bg-transparent"
                onClick={() => handleWeightSelect(currentWeight + 15)}
              >
                {currentWeight + 15} lbs
              </Button>
  
              <div className="mt-4 flex gap-2">
                <Input
                  type="number"
                  placeholder="Custom weight"
                  value={customWeight}
                  onChange={(e) => setCustomWeight(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleCustomWeightSubmit()
                    }
                  }}
                  className="h-14 text-lg"
                />
                <Button onClick={handleCustomWeightSubmit} className="h-14 px-6">
                  Set
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
  
        <div className="p-6">
          <button
            onClick={handleSetAction}
            className={`w-full rounded-2xl py-8 text-center transition-colors ${
              allSetsComplete
                ? "bg-green-100 hover:bg-green-200 active:bg-green-300 dark:bg-green-950 dark:hover:bg-green-900 dark:active:bg-green-800"
                : "bg-muted hover:bg-muted/80 active:bg-muted/60"
            }`}
          >
            <div className={`text-xl font-semibold ${allSetsComplete ? "text-green-900 dark:text-green-100" : ""}`}>
              {allSetsComplete
                ? "Next Exercise"
                : isViewingPastSet
                  ? `Save Set ${selectedSet + 1}`
                  : `Complete Set ${selectedSet + 1}`}
            </div>
            <div
              className={`mt-1 text-sm ${allSetsComplete ? "text-green-700 dark:text-green-200" : "text-muted-foreground"}`}
            >
              Tap anywhere here
            </div>
          </button>
        </div>
      </div>
    )
  }