"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"

interface AddSubredditModalProps {
  children: React.ReactNode
  onAddSubreddit: (subreddit: { name: string; url: string }) => void
}

export function AddSubredditModal({ children, onAddSubreddit }: AddSubredditModalProps) {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Extraire le nom du subreddit de l'URL
    const match = url.match(/reddit\.com\/r\/([^/]+)/i)
    if (!match) {
      // TODO: Ajouter un message d'erreur
      return
    }

    const name = match[1]
    onAddSubreddit({ name, url })
    setUrl("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)}>{children}</div>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Add New Subreddit
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="url" className="text-sm font-medium">
              Subreddit URL
            </Label>
            <Input
              id="url"
              placeholder="https://www.reddit.com/r/subreddit"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="h-11 px-4"
            />
            <p className="text-xs text-muted-foreground">
              Enter the full URL of the subreddit you want to track
            </p>
          </div>
          <Button
            type="submit"
            className="w-full h-11 text-base font-medium"
          >
            Add Subreddit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function AddSubredditButton({ onOpen }: { onOpen: () => void }) {
  return (
    <Button 
      variant="outline" 
      onClick={onOpen}
      className="bg-background hover:bg-accent transition-colors duration-200"
    >
      <Plus className="mr-2 h-5 w-5 text-primary" />
      Add Subreddit
    </Button>
  )
}
  
  